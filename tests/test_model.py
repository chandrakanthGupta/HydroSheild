import pytest
import numpy as np
from main import ml_model

def test_ml_model_prediction_shape():
    """Verify ML model produces valid probability distributions."""
    sample_input = [[150.0, 15.0, 80.0, 28.0]] # [water_depth, precip, humidity, temp]
    probabilities = ml_model.predict_proba(sample_input)[0]
    assert len(probabilities) == 3
    assert np.isclose(sum(probabilities), 1.0, atol=1e-5)

def test_ml_critical_threshold():
    """Verify severe storm inputs output elevated overflow risk."""
    storm_input = [[240.0, 45.0, 95.0, 26.0]]
    probabilities = ml_model.predict_proba(storm_input)[0]
    risk_score = round(float(probabilities[2]) * 100, 1)
    assert risk_score >= 50.0

def test_ml_normal_baseline():
    """Verify dry and low water clearance produces low risk."""
    normal_input = [[20.0, 0.0, 50.0, 30.0]]
    probabilities = ml_model.predict_proba(normal_input)[0]
    normal_prob = probabilities[0]
    assert normal_prob > 0.6
