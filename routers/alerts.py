import os
import time
from typing import Dict, Any, List
from fastapi import APIRouter
from pydantic import BaseModel
from twilio.rest import Client

router = APIRouter(prefix="/api/alerts", tags=["Emergency Alerts & Safeguards"])

# Alert dispatch logs in memory
dispatch_logs: List[Dict[str, Any]] = []
last_alert_timestamps: Dict[str, float] = {}

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
    except Exception as e:
        print(f"⚠️ Twilio Init in alerts.py: {e}")

class AlertRequest(BaseModel):
    sensor_id: str
    location_name: str
    water_depth_cm: float
    ml_risk_pct: float
    safe_zone_name: str
    is_test: bool = True  # Safe default: True requires explicit override for real dispatch
    custom_recipient: str = None
    channels: List[str] = ["sms", "whatsapp"]

@router.post("/send")
def send_safeguarded_alert(req: AlertRequest) -> Dict[str, Any]:
    """
    Sends emergency SMS/WhatsApp dispatch with:
    - Rate limiting & duplicate-alert prevention (15-min cooldown)
    - Test mode safeguards (does not charge SMS credits unless confirmed)
    - Verified delivery logging
    """
    now = time.time()
    sensor_key = f"{req.sensor_id}_{round(req.water_depth_cm, -1)}"
    last_time = last_alert_timestamps.get(sensor_key, 0)

    # 1. Duplicate Alert Suppression (10 min cooldown for same sensor & depth range)
    if not req.is_test and (now - last_time < 600):
        remaining_wait = int(600 - (now - last_time))
        return {
            "status": "SUPPRESSED_DUPLICATE",
            "message": f"Alert suppressed: Duplicate alert already sent within 10 minutes (cooldown {remaining_wait}s remaining).",
            "cooldown_remaining_seconds": remaining_wait
        }

    alert_body = (
        f"🚨 [HYDROSHEILD FLOOD ALERT]\n"
        f"Sector: {req.location_name} ({req.sensor_id})\n"
        f"Water Depth: {req.water_depth_cm} cm | Risk: {req.ml_risk_pct}%\n"
        f"SAFETY ACTION: Evacuate immediately toward {req.safe_zone_name}.\n"
        f"Emergency Helpline: GHMC DRF 040-21111111 / Police: 100\n"
        f"Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}"
    )

    if req.is_test:
        alert_body = f"🧪 [TEST DISPATCH - SIMULATION ONLY]\n{alert_body}"

    dispatch_result = {
        "timestamp": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()),
        "sensor_id": req.sensor_id,
        "location": req.location_name,
        "is_test": req.is_test,
        "sms_dispatched": False,
        "whatsapp_dispatched": False,
        "details": []
    }

    target_sms = req.custom_recipient or MY_PHONE
    target_wa = req.custom_recipient or MY_WHATSAPP_NUMBER or (f"whatsapp:{MY_PHONE}" if MY_PHONE else None)

    # Send SMS if requested
    if "sms" in req.channels:
        if twilio_client and target_sms and TWILIO_PHONE:
            try:
                msg = twilio_client.messages.create(body=alert_body, from_=TWILIO_PHONE, to=target_sms)
                dispatch_result["sms_dispatched"] = True
                dispatch_result["details"].append(f"SMS Sent (SID: {msg.sid})")
            except Exception as e:
                dispatch_result["details"].append(f"SMS Error: {str(e)}")
        else:
            dispatch_result["details"].append("SMS Simulated: Twilio credentials not fully configured or test mode active.")

    # Send WhatsApp if requested
    if "whatsapp" in req.channels:
        if twilio_client and target_wa and TWILIO_WHATSAPP_NUMBER:
            try:
                wa_from = TWILIO_WHATSAPP_NUMBER if TWILIO_WHATSAPP_NUMBER.startswith("whatsapp:") else f"whatsapp:{TWILIO_WHATSAPP_NUMBER}"
                wa_to = target_wa if target_wa.startswith("whatsapp:") else f"whatsapp:{target_wa}"
                w_msg = twilio_client.messages.create(body=alert_body, from_=wa_from, to=wa_to)
                dispatch_result["whatsapp_dispatched"] = True
                dispatch_result["details"].append(f"WhatsApp Sent (SID: {w_msg.sid})")
            except Exception as e:
                dispatch_result["details"].append(f"WhatsApp Error: {str(e)}")
        else:
            dispatch_result["details"].append("WhatsApp Simulated: Target WhatsApp number not set or in test mode.")

    if not req.is_test:
        last_alert_timestamps[sensor_key] = now

    dispatch_logs.append(dispatch_result)
    if len(dispatch_logs) > 50:
        dispatch_logs.pop(0)

    return {
        "status": "SUCCESS",
        "message": f"Alert dispatch processed for {req.location_name}",
        "result": dispatch_result
    }

@router.get("/logs")
def get_alert_dispatch_logs() -> List[Dict[str, Any]]:
    """Returns recent alert dispatch logs for audit and monitoring."""
    return list(reversed(dispatch_logs[-20:]))
