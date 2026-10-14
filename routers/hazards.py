from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter(prefix="/api/hazards", tags=["Hazard Analysis & Upstream Inundation"])

HAZARD_ZONES: List[Dict[str, Any]] = [
    {
        "hazard_id": "HAZ-01",
        "name": "Nakkhu-Lele Mountain Flash Flood & Slope Failure Corridor",
        "region": "Lalitpur Foothills (Kathmandu Southern Rim, Nepal)",
        "coordinates": {"lat": 27.5850, "lng": 85.3200},
        "hazard_type": "FLASH_FLOOD_AND_LANDSLIDE",
        "severity": "CRITICAL",
        "data_status": "OBSERVED_VERIFIED",
        "metrics": {
            "accumulated_rainfall_mm_24h": 311.0,
            "slope_angle_deg": 28.5,
            "soil_moisture_saturation_pct": 94.2,
            "landslide_susceptibility_index": "EXTREME (Grade 5/5)",
            "glof_exposure": "LOW (Non-glacial terrain)"
        },
        "upstream_trigger": "Orographic cloudburst cell locked against Mahabharat Range",
        "downstream_exposure": "Discharges violently into Bagmati River at Chobhar Gorge within 45 minutes",
        "recommended_action": "Evacuate riverside terrace settlements immediately."
    },
    {
        "hazard_id": "HAZ-02",
        "name": "Musi River Watershed Upper Catchment Deluge",
        "region": "Osman Sagar & Himayat Sagar Catchments (Hyderabad, India)",
        "coordinates": {"lat": 17.3750, "lng": 78.2950},
        "hazard_type": "RESERVOIR_SPILLWAY_DISCHARGE",
        "severity": "HIGH",
        "data_status": "ESTIMATED_RUNOFF_MODEL",
        "metrics": {
            "accumulated_rainfall_mm_24h": 84.0,
            "slope_angle_deg": 4.2,
            "soil_moisture_saturation_pct": 76.0,
            "landslide_susceptibility_index": "VERY_LOW (Deccan Plateau)",
            "reservoir_capacity_utilized_pct": 86.5
        },
        "upstream_trigger": "Sustained monsoon rain over Vikarabad & Ananthagiri hills",
        "downstream_exposure": "Forces opening of 4 reservoir gates; Moosarambagh and Chaderghat causeways flood in 2.5 hours",
        "recommended_action": "Sound siren at downstream causeway bridges; close traffic 2 hours in advance."
    },
    {
        "hazard_id": "HAZ-03",
        "name": "Tsho Rolpa & Dudh Koshi Glacial Basin Outburst Corridor",
        "region": "Rolwaling / Everest Region, Eastern Nepal",
        "coordinates": {"lat": 27.8500, "lng": 86.4800},
        "hazard_type": "POTENTIAL_GLOF_OUTBURST",
        "severity": "WATCH_ADVISORY",
        "data_status": "MONITORED_SATELLITE_ALTIMETRY",
        "metrics": {
            "lake_surface_elevation_m": 4580.0,
            "moraine_dam_freeboard_m": 12.0,
            "ice_core_stability": "MODERATE_RISK",
            "downstream_settlement_travel_time_hours": 3.8,
            "glof_exposure": "HIGH (Monitored by Early Warning Siren Network)"
        },
        "upstream_trigger": "Moraine collapse or ice avalanche into proglacial lake",
        "downstream_exposure": "Bhotekoshi & Sun Koshi river settlements along Araniko Highway",
        "recommended_action": "Continuous automated acoustic & water-level sensor telemetry."
    }
]

@router.get("/summary")
def get_hazard_summary() -> List[Dict[str, Any]]:
    """Returns hazard analysis layers including steep terrain, rapid accumulation, and upstream risk propagation."""
    return HAZARD_ZONES
