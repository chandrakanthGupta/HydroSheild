import asyncio
from datetime import datetime, timezone
import os
import random
import sys
import time
from typing import Dict, List

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


import certifi
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import numpy as np
from pydantic import BaseModel
import pymongo
from pymongo import MongoClient
import requests
from sklearn.ensemble import RandomForestClassifier
from twilio.rest import Client

from routers import historical, satellite, rescue, hazards, alerts

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI(
    title="HydroSheild Flood Intelligence API",
    description="Enterprise Multi-Hazard Flood Monitoring, Nepal Historical Disaster Analytics, and Satellite Intelligence",
    version="3.5.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Enforce security headers across all API responses."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Mount Modular Routers
app.include_router(historical.router)
app.include_router(satellite.router)
app.include_router(rescue.router)
app.include_router(hazards.router)
app.include_router(alerts.router)


# 1. Initialize Gemini Client
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=GEMINI_KEY) if GEMINI_KEY else None

# 2. Initialize MongoDB Atlas Client
MONGO_URI = os.getenv("MONGODB_URI")
db_client = None
telemetry_collection = None

try:
    if MONGO_URI:
        db_client = MongoClient(
            MONGO_URI,
            tls=True,
            tlsAllowInvalidCertificates=True,
            tlsAllowInvalidHostnames=True,
            serverSelectionTimeoutMS=5000,
        )
        db_client.admin.command("ping")
        db = db_client["hydrosheild_db"]
        telemetry_collection = db["telemetry_logs"]
        print("🍃 Connected successfully to MongoDB Atlas!")
    else:
        print("⚠️ MONGODB_URI not found in .env. Running in memory mode.")
except Exception as e:
    print(f"⚠️ MongoDB Atlas connection error: {e}. Falling back to in-memory store.")

# 3. Initialize Twilio Client
TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE_NUMBER")
MY_PHONE = os.getenv("MY_PHONE_NUMBER")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886")
MY_WHATSAPP_NUMBER = os.getenv("MY_WHATSAPP_NUMBER")

twilio_client = None
if TWILIO_SID and TWILIO_TOKEN:
    try:
        twilio_client = Client(TWILIO_SID, TWILIO_TOKEN)
        print("📱 Twilio SMS & WhatsApp service active!")
    except Exception as e:
        print(f"⚠️ Twilio Init Error: {e}")


# 4. Train Scikit-Learn Hybrid Predictive Machine Learning Model
ml_model = RandomForestClassifier(n_estimators=25, random_state=42)

def train_ml_model():
    """Trains a Random Forest classifier on historical flood risk patterns."""
    np.random.seed(42)
    # Synthetic feature matrix: [water_depth_cm, rain_rate_mm_hr, humidity_pct, temp_c]
    X_sample = []
    y_sample = []
    
    for _ in range(500):
        depth = np.random.uniform(20, 250)
        rain = np.random.uniform(0, 50)
        humidity = np.random.uniform(40, 95)
        temp = np.random.uniform(20, 38)
        
        # Risk levels: 0 = Normal, 1 = Warning, 2 = Critical
        if depth >= 180 or rain >= 25:
            label = 2
        elif depth >= 100 or rain >= 10:
            label = 1
        else:
            label = 0
            
        X_sample.append([depth, rain, humidity, temp])
        y_sample.append(label)
        
    ml_model.fit(X_sample, y_sample)
    print("🤖 [HYBRID AI] Scikit-Learn Random Forest Flood Classifier Trained Successfully!")

train_ml_model()

# In-Memory Cache
latest_nodes: Dict[str, dict] = {}
memory_history: List[dict] = []
storm_triggers: Dict[str, bool] = {}

# Expanded 10-Node Metropolitan Flood Sensor Network
CLOUD_SIMULATOR_NODES = [
    {
        "sensor_id": "HYD-NALA-001",
        "location_name": "Koti Drain",
        "lat": 17.3850,
        "lng": 78.4867,
        "drf_unit": "DRF Unit 01 (Central Zone)",
        "chokepoint_rating": "8/10 (High Encroachment)",
        "safe_zone": {"name": "GHMC Sultan Bazar Relief Center", "lat": 17.3895, "lng": 78.4910}
    },
    {
        "sensor_id": "HYD-NALA-002",
        "location_name": "Begumpet Nala",
        "lat": 17.4440,
        "lng": 78.4660,
        "drf_unit": "DRF Unit 03 (North Zone)",
        "chokepoint_rating": "6/10 (Moderate Bottleneck)",
        "safe_zone": {"name": "Prakash Nagar High Ground Hall", "lat": 17.4495, "lng": 78.4715}
    },
    {
        "sensor_id": "HYD-NALA-003",
        "location_name": "Lakdikapul Underpass",
        "lat": 17.4010,
        "lng": 78.4630,
        "drf_unit": "DRF Unit 02 (Khairatabad Zone)",
        "chokepoint_rating": "9/10 (Critical Underpass)",
        "safe_zone": {"name": "Nizam College Emergency Grounds", "lat": 17.4065, "lng": 78.4685}
    },
    {
        "sensor_id": "HYD-NALA-004",
        "location_name": "Amberpet Sewer Gate",
        "lat": 17.3880,
        "lng": 78.5120,
        "drf_unit": "DRF Unit 05 (East Zone)",
        "chokepoint_rating": "7/10 (Heavy Silt Deposit)",
        "safe_zone": {"name": "Ali Cafe Stadium Safe Haven", "lat": 17.3935, "lng": 78.5175}
    },
    {
        "sensor_id": "HYD-NALA-005",
        "location_name": "Tolichowki Nadeem Colony",
        "lat": 17.3980,
        "lng": 78.4120,
        "drf_unit": "DRF Unit 04 (Karwan Zone)",
        "chokepoint_rating": "10/10 (Low-Lying Basin)",
        "safe_zone": {"name": "Nizamia Sports Complex Shelter", "lat": 17.4025, "lng": 78.4170}
    },
    {
        "sensor_id": "HYD-NALA-006",
        "location_name": "Moosarambagh Cause Bridge",
        "lat": 17.3680,
        "lng": 78.5150,
        "drf_unit": "DRF Unit 06 (Musi River Patrol)",
        "chokepoint_rating": "9/10 (River Overflow Point)",
        "safe_zone": {"name": "Malakpet Junior College Grounds", "lat": 17.3725, "lng": 78.5195}
    },
    {
        "sensor_id": "HYD-NALA-007",
        "location_name": "Malakpet Underpass",
        "lat": 17.3750,
        "lng": 78.4980,
        "drf_unit": "DRF Unit 07 (South-East)",
        "chokepoint_rating": "8/10 (Railway Track Sump)",
        "safe_zone": {"name": "Chaderghat High School Shelter", "lat": 17.3795, "lng": 78.5025}
    },
    {
        "sensor_id": "HYD-NALA-008",
        "location_name": "Kukatpally Y-Junction",
        "lat": 17.4850,
        "lng": 78.4080,
        "drf_unit": "DRF Unit 08 (Kukatpally Zone)",
        "chokepoint_rating": "7/10 (High Volume Junction)",
        "safe_zone": {"name": "KPHB Community Hall", "lat": 17.4895, "lng": 78.4125}
    },
    {
        "sensor_id": "HYD-NALA-009",
        "location_name": "Khairatabad Nala Channel",
        "lat": 17.4120,
        "lng": 78.4610,
        "drf_unit": "DRF Unit 02 (Khairatabad Zone)",
        "chokepoint_rating": "8/10 (Bottle-neck Canal)",
        "safe_zone": {"name": "Khairatabad Govt Degree College", "lat": 17.4165, "lng": 78.4655}
    },
    {
        "sensor_id": "HYD-NALA-010",
        "location_name": "Hafizpet Cyberabad Drain",
        "lat": 17.4920,
        "lng": 78.3520,
        "drf_unit": "DRF Unit 09 (IT Corridor)",
        "chokepoint_rating": "6/10 (High Storm Runoff)",
        "safe_zone": {"name": "Kondapur Indoor Sports Stadium", "lat": 17.4965, "lng": 78.3565}
    },
]

async def background_cloud_simulator():
    """24/7 Background task generating live telemetry & IoT health metrics."""
    while True:
        try:
            for node in CLOUD_SIMULATOR_NODES:
                s_id = node["sensor_id"]

                if storm_triggers.get(s_id):
                    water_depth = round(random.uniform(210.0, 240.0), 2)
                    status = "CRITICAL"
                else:
                    water_depth = round(random.uniform(65.0, 95.0), 2)
                    status = "NORMAL"

                clearance = round(300.0 - water_depth, 2)
                now_ts = int(time.time())

                # Evaluate Scikit-Learn ML Risk Score
                features = [[water_depth, 0.1, 60.0, 30.0]]
                proba = ml_model.predict_proba(features)[0]
                ml_risk_pct = round(float(proba[2] if len(proba) > 2 else proba[-1]) * 100, 1)

                payload = {
                    "sensor_id": s_id,
                    "location_name": node["location_name"],
                    "lat": node["lat"],
                    "lng": node["lng"],
                    "timestamp": now_ts,
                    "iso_timestamp": datetime.now(timezone.utc).isoformat(),
                    "water_clearance_cm": clearance,
                    "water_depth_cm": water_depth,
                    "battery_voltage": round(random.uniform(3.78, 3.88), 2),
                    "signal_rssi": random.randint(-68, -58),
                    "fog_compression_savings_pct": 42.5,
                    "status": status,
                    "safe_zone": node["safe_zone"],
                    "ml_risk_score_pct": ml_risk_pct
                }

                latest_nodes[s_id] = payload
                memory_history.append(payload)
                if len(memory_history) > 300:
                    memory_history.pop(0)

                if telemetry_collection is not None:
                    try:
                        telemetry_collection.insert_one(payload.copy())
                    except Exception:
                        pass

            await asyncio.sleep(3)
        except Exception as err:
            print(f"Cloud Simulator Error: {err}")
            await asyncio.sleep(5)


@app.on_event("startup")
async def start_background_tasks():
    asyncio.create_task(background_cloud_simulator())


@app.get("/")
def read_root():
    return {
        "system": "HydroSheild Flood API",
        "status": "ONLINE",
        "ml_model": "Scikit-Learn Random Forest Classifier Active",
        "cloud_simulator": "Active 24/7",
        "database": "MongoDB Atlas Connected" if telemetry_collection is not None else "In-Memory",
        "sms_service": "Active" if twilio_client else "Disabled",
    }


@app.get("/api/nodes/latest")
def get_latest_nodes():
    return {"nodes": list(latest_nodes.values())}


@app.get("/api/nodes/{sensor_id}/history")
def get_node_history(sensor_id: str):
    if telemetry_collection is not None:
        try:
            records = list(
                telemetry_collection.find({"sensor_id": sensor_id}, {"_id": 0})
                .sort("timestamp", pymongo.DESCENDING)
                .limit(20)
            )
            records.reverse()
            return {"sensor_id": sensor_id, "history": records}
        except Exception as e:
            print(f"MongoDB Fetch Error: {e}")

    history = [r for r in memory_history if r["sensor_id"] == sensor_id]
    return {"sensor_id": sensor_id, "history": history[-20:]}


@app.get("/api/weather/live")
def get_live_weather():
    lat, lng = 17.3850, 78.4867

    max_depth = 0.0
    if latest_nodes:
        depths = [n.get("water_depth_cm", 0.0) for n in latest_nodes.values()]
        max_depth = max(depths) if depths else 0.0

    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m"
        resp = requests.get(url, timeout=4)
        data = resp.json()

        current_w = data.get("current", {})
        temp = current_w.get("temperature_2m", 28.5)
        humidity = current_w.get("relative_humidity_2m", 78)
        precip = current_w.get("precipitation", 0.0)
        wind = current_w.get("wind_speed_10m", 12.0)
    except Exception:
        temp, humidity, precip, wind = 29.0, 82, 0.0, 10.5

    # Run Machine Learning Inference
    ml_proba = ml_model.predict_proba([[max_depth, precip, humidity, temp]])[0]
    ml_risk_pct = round(float(ml_proba[2] if len(ml_proba) > 2 else ml_proba[-1]) * 100, 1)

    if ml_risk_pct >= 70.0 or max_depth >= 200.0 or precip > 30.0:
        forecast_status = "CRITICAL OVERFLOW RISK"
        est_time_to_overflow = "10 - 15 Minutes"
        advisory = "Severe storm runoff detected by ML Classifier! Evacuation to high-ground safe zones advised."
        risk_level = "CRITICAL"
    elif ml_risk_pct >= 35.0 or max_depth >= 100.0:
        forecast_status = "MODERATE INUNDATION RISK"
        est_time_to_overflow = "30 - 45 Minutes"
        advisory = "Drain capacity approaching 60%. Monitor water clearance and prepare barriers."
        risk_level = "WARNING"
    else:
        forecast_status = "STABLE / NORMAL CAPACITY"
        est_time_to_overflow = "No Overflow Risk (> 3 Hours)"
        advisory = "Drainage channels operating within safe parameters. Normal monitoring active."
        risk_level = "NORMAL"

    return {
        "location": "Hyderabad Metropolitan Area",
        "temperature_c": temp,
        "humidity_percent": humidity,
        "precipitation_mm_hr": precip,
        "wind_kmh": wind,
        "max_node_depth_cm": round(max_depth, 1),
        "ml_predictive_risk_pct": ml_risk_pct,
        "predictive_forecast": {
            "status": forecast_status,
            "risk_level": risk_level,
            "est_time_to_overflow": est_time_to_overflow,
            "advisory": advisory,
        },
    }


def dispatch_emergency_alert(sensor_id: str, location_name: str, water_depth_cm: float, ml_score: float, safe_zone_name: str):
    """Dispatches real-time SMS and WhatsApp sirens via Twilio API with error handling."""
    alert_result = {"sms_sent": False, "whatsapp_sent": False, "details": []}

    sms_body = (
        f"🚨 HYDROSHEILD CRITICAL FLOOD ALERT\n"
        f"Location: {location_name} ({sensor_id})\n"
        f"Water Depth: {water_depth_cm} cm | Overflow Risk: {ml_score}%\n"
        f"EVACUATION DIRECTIVE: Move immediately toward {safe_zone_name}.\n"
        f"Emergency Helpline: GHMC DRF 040-21111111 / Police: 100"
    )

    if twilio_client and MY_PHONE and TWILIO_PHONE:
        try:
            msg = twilio_client.messages.create(body=sms_body, from_=TWILIO_PHONE, to=MY_PHONE)
            alert_result["sms_sent"] = True
            alert_result["details"].append(f"SMS SID: {msg.sid}")
            print(f"📱 SMS Dispatched to {MY_PHONE}! SID: {msg.sid}")
        except Exception as sms_err:
            alert_result["details"].append(f"SMS Error: {sms_err}")
            print(f"⚠️ Twilio SMS Delivery Error: {sms_err}")

    # WhatsApp Siren Alert
    target_wa = MY_WHATSAPP_NUMBER or (f"whatsapp:{MY_PHONE}" if MY_PHONE else None)
    if twilio_client and target_wa and TWILIO_WHATSAPP_NUMBER:
        try:
            wa_from = TWILIO_WHATSAPP_NUMBER if TWILIO_WHATSAPP_NUMBER.startswith("whatsapp:") else f"whatsapp:{TWILIO_WHATSAPP_NUMBER}"
            wa_to = target_wa if target_wa.startswith("whatsapp:") else f"whatsapp:{target_wa}"
            wa_msg = twilio_client.messages.create(body=sms_body, from_=wa_from, to=wa_to)
            alert_result["whatsapp_sent"] = True
            alert_result["details"].append(f"WhatsApp SID: {wa_msg.sid}")
            print(f"💬 WhatsApp Alert Dispatched to {wa_to}! SID: {wa_msg.sid}")
        except Exception as wa_err:
            alert_result["details"].append(f"WhatsApp Error: {wa_err}")
            print(f"⚠️ Twilio WhatsApp Error: {wa_err}")

    return alert_result


@app.post("/api/ai/emergency-plan")
def generate_ai_emergency_plan(sensor_id: str, location_name: str, water_depth_cm: float, language: str = "en"):
    # Fetch ML Risk Score for Gemini Context
    node_data = latest_nodes.get(sensor_id, {})
    ml_score = node_data.get("ml_risk_score_pct", 85.0 if water_depth_cm >= 200 else 12.0)
    safe_zone_name = node_data.get("safe_zone", {}).get("name", "Nearest High-Ground Relief Hall")

    if water_depth_cm >= 200.0:
        severity = "SEVERE CLOUDBURST / HIGH OVERFLOW RISK"
    elif water_depth_cm >= 100.0:
        severity = "MODERATE INUNDATION / WARNING"
    else:
        severity = "ELEVATED WATER LEVEL / ADVISORY"

    if language == "hi":
        prompt = f"""
        [आपदा प्रबंधन आपातकालीन प्रोटोकॉल - HydroSheild AI Grid]
        सेंसर आईडी: {sensor_id}
        स्थान: {location_name}, हैदराबाद
        दर्ज जल स्तर: {water_depth_cm} सेमी
        मशीन लर्निंग बाढ़ जोखिम: {ml_score}%
        सुरक्षित क्षेत्र / राहत आश्रय: {safe_zone_name}
        चेतावनी स्तर: {severity}

        कृपया नगर निगम आपदा प्रतिक्रिया बल (DRF) और नागरिकों के लिए स्पष्ट, आधिकारिक और तत्काल 3-चरणीय आपातकालीन कार्य योजना हिंदी में प्रस्तुत करें:

        1. बैरिकेड्स और पुलिस नाकाबंदी (Exact Barricades & Cordons):
           • {location_name} के 300 मीटर के दायरे में किन प्रमुख चौराहों को तुरंत बंद करना है।
           • जलमग्न अंडरपास पर बैरिकेडिंग की व्यवस्था।

        2. सुरक्षित निकासी मार्ग (Safe Zone Evacuation Route):
           • नागरिकों को {safe_zone_name} की ओर ले जाने का सुरक्षित और ऊंचा मार्ग।
           • भारी वाहनों और एम्बुलेंस के लिए वैकल्पिक डायवर्जन।

        3. नागरिक सुरक्षा निर्देश और हेल्पलाइन (Citizen Safety & Helpline):
           • GHMC नियंत्रण कक्ष: 040-21111111, पुलिस: 100।
           • बिजली के खंभों और खुले नालों से दूरी बनाए रखने का संदेश।
        """
    else:
        prompt = f"""
        [CRITICAL URBAN FLOOD ADVISORY SYSTEM - HydroSheild AI Grid]
        Sensor ID: {sensor_id}
        Location: {location_name}, Hyderabad
        Recorded Water Depth: {water_depth_cm} cm
        Machine Learning Overflow Probability: {ml_score}%
        Designated Evacuation Shelter: {safe_zone_name}
        Alert Level: {severity}

        Provide an official, highly detailed 3-step Emergency Action Protocol for municipal disaster responders:

        1. EXACT BARRICADE & CORDONS: Specific street intersections around {location_name} to seal off immediately to prevent vehicle strandings.
        2. SAFE ZONE EVACUATION ROUTE: Clear elevated navigation directions directing citizens to {safe_zone_name}.
        3. CITIZEN SAFETY & BROADCAST DIRECTIVE: Emergency public advisory directives including GHMC DRF Helpline numbers (040-21111111 / Police: 100).
        """

    try:
        if not gemini_client:
            raise Exception("Gemini API Client not initialized")
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        plan_text = response.text
    except Exception as e:
        if language == "hi":
            plan_text = (
                f"🚨 [आधिकारिक आपदा प्रबंधन आपातकालीन प्रोटोकॉल]\n"
                f"📍 लक्षित क्षेत्र: {location_name} ({sensor_id})\n"
                f"🧠 बाढ़ जोखिम सूचकांक: {ml_score}%\n"
                f"🌊 वर्तमान जल स्तर: {water_depth_cm} सेमी | स्थिति: {severity}\n\n"
                f"1. पुलिस और आपदा प्रतिक्रिया नाकाबंदी:\n"
                f"   • {location_name} के 300 मीटर दायरे में सभी वाहन प्रवेश द्वारों को सील करें।\n"
                f"   • अंडरपास और नालों के पास DRF कर्मियों को तैनात करें।\n\n"
                f"2. सुरक्षित आश्रय निकासी मार्ग:\n"
                f"   • सभी नागरिकों को तुरंत '{safe_zone_name}' की ओर निर्देशित करें।\n"
                f"   • वाहनों को ऊंचे रिंग रोड मार्गों की ओर मोड़ें।\n\n"
                f"3. सार्वजनिक सुरक्षा और हेल्पलाइन निर्देश:\n"
                f"   • GHMC आपदा नियंत्रण कक्ष: 040-21111111 / पुलिस आपातकालीन: 100।"
            )
        else:
            plan_text = (
                f"🚨 [OFFICIAL DISASTER MANAGEMENT PROTOCOL]\n"
                f"📍 Target Zone: {location_name} ({sensor_id})\n"
                f"🧠 ML Overflow Risk Score: {ml_score}%\n"
                f"🌊 Current Water Level: {water_depth_cm} cm | Status: {severity}\n\n"
                f"1. POLICE & DISASTER RESPONSE CORDONS:\n"
                f"   • Seal off all vehicular entry points within 300m radius of {location_name}.\n"
                f"   • Station DRF personnel at low-lying underpasses to prevent entry.\n\n"
                f"2. EVACUATION TO SAFE ZONE:\n"
                f"   • Direct all evacuees toward: {safe_zone_name}.\n"
                f"   • Redirect vehicles via elevated arterial ring roads.\n\n"
                f"3. PUBLIC SAFETY DIRECTIVE:\n"
                f"   • GHMC Emergency Control Room Helpline: 040-21111111 / Police: 100."
            )

    # Automatically dispatch siren alerts if level is CRITICAL
    alert_info = {}
    if water_depth_cm >= 180.0:
        alert_info = dispatch_emergency_alert(sensor_id, location_name, water_depth_cm, ml_score, safe_zone_name)

    return {"sensor_id": sensor_id, "action_plan": plan_text, "alerts": alert_info}


@app.post("/api/alerts/dispatch")
def trigger_alert_dispatch(sensor_id: str):
    node = latest_nodes.get(sensor_id, {
        "location_name": "Hyderabad Bottleneck",
        "water_depth_cm": 225.0,
        "ml_risk_score_pct": 95.0,
        "safe_zone": {"name": "GHMC Relief Center"}
    })
    safe_zone_name = node.get("safe_zone", {}).get("name", "GHMC Safe Haven")
    res = dispatch_emergency_alert(
        sensor_id=sensor_id,
        location_name=node.get("location_name", "Drain Chokepoint"),
        water_depth_cm=node.get("water_depth_cm", 200.0),
        ml_score=node.get("ml_risk_score_pct", 92.0),
        safe_zone_name=safe_zone_name
    )
    return {
        "status": "success",
        "message": f"Emergency alerts dispatched for {node.get('location_name', sensor_id)}",
        "result": res
    }


@app.post("/api/simulate/cloudburst")
def simulate_cloudburst(sensor_id: str):
    print(f"\n⛈️ [SERVER] Cloudburst API Triggered for node: {sensor_id}!")
    storm_triggers[sensor_id] = True

    if sensor_id in latest_nodes:
        latest_nodes[sensor_id]["water_clearance_cm"] = 18.0
        latest_nodes[sensor_id]["water_depth_cm"] = 232.0
        latest_nodes[sensor_id]["status"] = "CRITICAL"
        latest_nodes[sensor_id]["ml_risk_score_pct"] = 97.4

        if telemetry_collection is not None:
            try:
                telemetry_collection.insert_one(latest_nodes[sensor_id].copy())
            except Exception:
                pass
        memory_history.append(latest_nodes[sensor_id].copy())

        # Dispatch automatic alerts
        safe_zone_name = latest_nodes[sensor_id].get("safe_zone", {}).get("name", "Nearest Relief Hall")
        dispatch_emergency_alert(
            sensor_id,
            latest_nodes[sensor_id]["location_name"],
            232.0,
            97.4,
            safe_zone_name
        )

    return {
        "status": "success",
        "message": f"Cloudburst storm surge triggered for {sensor_id}",
    }


@app.post("/api/simulate/reset")
def reset_simulation(sensor_id: str = None):
    """Resets simulated storm surges back to normal baseline levels."""
    if sensor_id and sensor_id in storm_triggers:
        storm_triggers[sensor_id] = False
        if sensor_id in latest_nodes:
            latest_nodes[sensor_id]["water_depth_cm"] = 72.0
            latest_nodes[sensor_id]["water_clearance_cm"] = 228.0
            latest_nodes[sensor_id]["status"] = "NORMAL"
            latest_nodes[sensor_id]["ml_risk_score_pct"] = 14.2
    else:
        # Reset all triggers
        for s_id in list(storm_triggers.keys()):
            storm_triggers[s_id] = False
        for s_id in latest_nodes:
            latest_nodes[s_id]["water_depth_cm"] = 72.0
            latest_nodes[s_id]["water_clearance_cm"] = 228.0
            latest_nodes[s_id]["status"] = "NORMAL"
            latest_nodes[s_id]["ml_risk_score_pct"] = 14.2

    return {"status": "success", "message": "Telemetry restored to safe operational baseline"}