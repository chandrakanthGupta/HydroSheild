import json
import random
import time
from datetime import datetime, timezone
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000/api/telemetry")
DRAIN_TOTAL_DEPTH_CM = 250.0

# 4 Drainage Choke Points across Hyderabad
NODES = [
    {"id": "HYD-NALA-001", "name": "Koti Drain", "lat": 17.3850, "lng": 78.4867, "clearance": 180.0},
    {"id": "HYD-NALA-002", "name": "Begumpet Nala", "lat": 17.4447, "lng": 78.4664, "clearance": 140.0},
    {"id": "HYD-NALA-003", "name": "Malakpet Underpass", "lat": 17.3725, "lng": 78.4896, "clearance": 85.0},
    {"id": "HYD-NALA-004", "name": "Khairatabad Canal", "lat": 17.4111, "lng": 78.4613, "clearance": 195.0},
]

def generate_payload(node):
    # REALISTIC DRAINAGE PHYSICS:
    # If water clearance is low (< 180cm), the drain is flooded and recedes slowly (+3.0 to +5.0 cm per tick)
    if node["clearance"] < 175.0:
        node["clearance"] = round(
            min(180.0, node["clearance"] + random.uniform(3.0, 5.5)),
            2
        )
    else:
        # Normal minor fluctuations (+/- 2.5 cm)
        node["clearance"] = round(
            max(10.0, min(DRAIN_TOTAL_DEPTH_CM, node["clearance"] + random.uniform(-2.5, 2.5))),
            2
        )

    water_depth = round(DRAIN_TOTAL_DEPTH_CM - node["clearance"], 2)

    if node["clearance"] < 40.0:
        status = "CRITICAL"
    elif node["clearance"] < 90.0:
        status = "WARNING"
    else:
        status = "NORMAL"

    return {
        "sensor_id": node["id"],
        "location_name": node["name"],
        "lat": node["lat"],
        "lng": node["lng"],
        "timestamp": int(time.time()),
        "iso_timestamp": datetime.now(timezone.utc).isoformat(),
        "water_clearance_cm": node["clearance"],
        "water_depth_cm": water_depth,
        "battery_voltage": round(random.uniform(3.75, 4.12), 2),
        "signal_rssi": random.randint(-80, -60),
        "status": status
    }

def run_simulator():
    print("📡 Multi-Node Sensor Grid Simulator Active (4 Nodes)")
    print("Press Ctrl+C to stop.\n" + "=" * 55)

    while True:
        for node in NODES:
            payload = generate_payload(node)
            print(f"[{payload['status']}] {payload['sensor_id']} ({payload['location_name']}) | Depth: {payload['water_depth_cm']}cm")
            
            try:
                response = httpx.post(BACKEND_URL, json=payload, timeout=2.0)
                res_data = response.json()
                
                # Check if backend triggered a cloudburst for this node!
                if res_data.get("trigger_storm"):
                    node["clearance"] = 20.0  # Instant water surge to 230 cm depth!
                    print(f"⛈️ [CLOUDBURST SURGE DETECTED] Water level maxed out at {node['id']}!")
                    
            except Exception:
                print("➜ Waiting for FastAPI backend...")

        print("-" * 55)
        time.sleep(3)

if __name__ == "__main__":
    try:
        run_simulator()
    except KeyboardInterrupt:
        print("\n🛑 Simulation stopped.")