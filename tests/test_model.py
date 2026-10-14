import unittest

class TestModelSuite(unittest.TestCase):
    """Machine learning model validation."""

    def setUp(self):
        try:
            from main import ml_model
            self.model = ml_model
            self.available = True
        except Exception:
            self.available = False

    def test_model_probabilities(self):
        if not self.available:
            self.skipTest("ML dependencies not available in global test environment")
        sample_input = [[150.0, 15.0, 80.0, 28.0]]
        probabilities = self.model.predict_proba(sample_input)[0]
        self.assertEqual(len(probabilities), 3)

    def test_critical_risk(self):
        if not self.available:
            self.skipTest("ML dependencies not available")
        storm_input = [[240.0, 45.0, 95.0, 26.0]]
        probabilities = self.model.predict_proba(storm_input)[0]
        risk_score = round(float(probabilities[2]) * 100, 1)
        self.assertGreaterEqual(risk_score, 50.0)

if __name__ == "__main__":
    unittest.main()
