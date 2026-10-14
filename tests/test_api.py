import pytest
from fastapi.testclient import TestClient
from main import app, ml_model

client = TestClient(app)

def test_root_endpoint():
    """Verify system health, status and model information."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "HydroSheild" in data["system"]
    assert data["status"] == "ONLINE"
    # Verify Security Headers
    assert response.headers.get("x-content-type-options") == "nosniff"
    assert response.headers.get("x-frame-options") == "DENY"
    assert "max-age" in response.headers.get("strict-transport-security", "")

def test_get_latest_nodes():
    """Verify drainage telemetry nodes endpoint returns valid data."""
    response = client.get("/api/nodes/latest")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert isinstance(data["nodes"], list)
    if len(data["nodes"]) > 0:
        node = data["nodes"][0]
        assert "sensor_id" in node
        assert "water_depth_cm" in node
        assert "status" in node

def test_get_node_history():
    """Verify node telemetry history endpoint returns records."""
    response = client.get("/api/nodes/HYD-NALA-001/history")
    assert response.status_code == 200
    data = response.json()
    assert data["sensor_id"] == "HYD-NALA-001"
    assert "history" in data
    assert isinstance(data["history"], list)

def test_live_weather_endpoint():
    """Verify live meteorological weather analysis and predictive ML risk."""
    response = client.get("/api/weather/live")
    assert response.status_code == 200
    data = response.json()
    assert "temperature_c" in data
    assert "precipitation_mm_hr" in data
    assert "ml_predictive_risk_pct" in data
    assert "predictive_forecast" in data

def test_historical_nepal_disaster():
    """Verify Nepal 2024 disaster intelligence and historical records."""
    response = client.get("/api/historical/nepal-2024")
    assert response.status_code == 200
    data = response.json()
    assert "disaster_id" in data
    assert "title" in data

def test_hazards_summary():
    """Verify multi-hazard intelligence summary."""
    response = client.get("/api/hazards/summary")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "hazard_id" in data[0]

def test_rescue_prioritization():
    """Verify rescue operation corridor and route prioritization."""
    response = client.get("/api/rescue/prioritization")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "sector_id" in data[0]

def test_alerts_logs():
    """Verify emergency siren alert logs endpoint."""
    response = client.get("/api/alerts/logs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_simulate_cloudburst_and_reset():
    """Verify storm surge simulation and safe baseline reset."""
    surge_resp = client.post("/api/simulate/cloudburst?sensor_id=HYD-NALA-001")
    assert surge_resp.status_code == 200
    assert surge_resp.json()["status"] == "success"

    reset_resp = client.post("/api/simulate/reset?sensor_id=HYD-NALA-001")
    assert reset_resp.status_code == 200
    assert reset_resp.json()["status"] == "success"
