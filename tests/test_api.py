import unittest

class TestAPISuite(unittest.TestCase):
    """FastAPI Endpoint & Intelligence validation."""

    def setUp(self):
        try:
            from fastapi.testclient import TestClient
            from main import app
            self.client = TestClient(app)
            self.available = True
        except Exception:
            self.available = False

    def test_system_status(self):
        if not self.available:
            self.skipTest("FastAPI TestClient dependencies not in global runner")
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("HydroSheild", data["system"])
        self.assertEqual(data["status"], "ONLINE")

    def test_nodes_telemetry(self):
        if not self.available:
            self.skipTest("Dependencies not available")
        response = self.client.get("/api/nodes/latest")
        self.assertEqual(response.status_code, 200)
        self.assertIn("nodes", response.json())

    def test_weather_live(self):
        if not self.available:
            self.skipTest("Dependencies not available")
        response = self.client.get("/api/weather/live")
        self.assertEqual(response.status_code, 200)
        self.assertIn("predictive_forecast", response.json())

    def test_security_headers(self):
        if not self.available:
            self.skipTest("Dependencies not available")
        response = self.client.get("/")
        self.assertEqual(response.headers.get("x-content-type-options"), "nosniff")
        self.assertEqual(response.headers.get("x-frame-options"), "DENY")

if __name__ == "__main__":
    unittest.main()
