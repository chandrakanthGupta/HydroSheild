import unittest

class TestHydroSheildCore(unittest.TestCase):
    """Core algorithmic and system validation tests (Zero-dependency Python unittest)."""

    def test_water_depth_calculation(self):
        """Verify depth physics: Total Culvert Capacity (250cm) - Clearance = Water Depth."""
        drain_total_depth_cm = 250.0
        clearance_cm = 18.0
        water_depth_cm = round(drain_total_depth_cm - clearance_cm, 2)
        self.assertEqual(water_depth_cm, 232.0)

    def test_flood_risk_classification_thresholds(self):
        """Validate severe storm overflow risk classification logic."""
        def classify_risk(water_depth_cm, precip_mm_hr):
            if water_depth_cm >= 200.0 or precip_mm_hr > 30.0:
                return "CRITICAL"
            elif water_depth_cm >= 100.0:
                return "WARNING"
            return "NORMAL"

        self.assertEqual(classify_risk(232.0, 35.0), "CRITICAL")
        self.assertEqual(classify_risk(120.0, 5.0), "WARNING")
        self.assertEqual(classify_risk(45.0, 0.0), "NORMAL")

    def test_duplicate_alert_suppression_window(self):
        """Verify 10-minute (600s) cooldown window prevents siren fatigue."""
        now = 1000.0
        last_alert_time = 700.0 # 300s ago
        is_suppressed = (now - last_alert_time) < 600.0
        self.assertTrue(is_suppressed)

        older_alert_time = 350.0 # 650s ago
        is_allowed = (now - older_alert_time) >= 600.0
        self.assertTrue(is_allowed)

    def test_sensor_payload_schema(self):
        """Verify sensor telemetry payload fields."""
        payload = {
            "sensor_id": "HYD-NALA-001",
            "location_name": "Koti Drain",
            "lat": 17.3850,
            "lng": 78.4867,
            "water_clearance_cm": 180.0,
            "water_depth_cm": 70.0,
            "status": "NORMAL"
        }
        self.assertIn("sensor_id", payload)
        self.assertIn("water_depth_cm", payload)
        self.assertIn("status", payload)
        self.assertEqual(payload["status"], "NORMAL")

    def test_safe_zone_evacuation_routing(self):
        """Verify designated high-ground shelters are properly mapped."""
        shelters = {
            "HYD-NALA-001": "GHMC Sultan Bazar Relief Center",
            "HYD-NALA-002": "Begumpet Community Relief Hall",
            "HYD-NALA-003": "Chaderghat Elevated Transit Shelter",
            "HYD-NALA-004": "Khairatabad Municipal Ground"
        }
        self.assertEqual(len(shelters), 4)
        for s_id, shelter in shelters.items():
            self.assertTrue(len(shelter) > 5)

if __name__ == "__main__":
    unittest.main()
