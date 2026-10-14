# 🌊 HydroSheild — Autonomous Urban Flood Monitoring & AI Dispatch Grid

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://hydro-sheild.vercel.app)
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://hydrosheild.onrender.com)
[![Database: MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![AI: Google Gemini 2.5 Flash](https://img.shields.io/badge/AI-Google%20Gemini%202.5--Flash-8E75B2?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Alerts: Twilio API](https://img.shields.io/badge/Alerts-Twilio%20SMS%20%26%20WhatsApp-F22F46?logo=twilio&logoColor=white)](https://www.twilio.com/)

> 🚀 **Live Production Application:** [https://hydro-sheild.vercel.app](https://hydro-sheild.vercel.app)  
> ⚡ **Cloud API Service (Render):** [https://hydrosheild.onrender.com](https://hydrosheild.onrender.com)  
> 📁 **GitHub Source Repository:** [https://github.com/chandrakanthGupta/HydroSheild](https://github.com/chandrakanthGupta/HydroSheild)

---

## 📌 Executive Summary

Urban drainage networks in high-density metropolitan zones (such as Hyderabad and Kathmandu) are vulnerable to sudden cloudburst surges, choked arterial culverts, and rapid inundation. Conventional monitoring relies on lagging public emergency calls or manual inspections.

**HydroSheild** is an enterprise-grade, autonomous flood intelligence and emergency response platform. It fuses **live IoT drainage telemetry**, **real-time atmospheric weather metrics**, **Random Forest machine-learning overflow prediction**, and **Google Gemini 2.5 Flash generative advisory synthesis** to trigger multi-carrier SMS/WhatsApp sirens and calculate safe evacuation corridors before city streets submerge.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph IoT_Layer ["📡 Layer 1: IoT Sensor Edge & Telemetry Simulation"]
        S1["Koti Drain Node\n(HYD-NALA-001)"]
        S2["Begumpet Nala Node\n(HYD-NALA-002)"]
        S3["Malakpet Underpass Node\n(HYD-NALA-003)"]
        S4["Khairatabad Canal Node\n(HYD-NALA-004)"]
        Sim["Async Background Engine\n(3-Second Polling & Fluctuations)"]
        S1 & S2 & S3 & S4 --> Sim
    end

    subgraph Meteorology ["🌧️ Layer 2: Meteorological Intelligence"]
        OM["Open-Meteo REST API\n• Live Precipitation (mm/hr)\n• Relative Humidity (%)\n• Wind Speed & Temperature"]
    end

    subgraph Backend_Core ["⚙️ Layer 3: FastAPI Backend Processing Grid"]
        API["FastAPI App Core (/api/nodes/latest)"]
        ML["Random Forest Classifier\nFeatures: Depth, Rainfall, Humidity, Temp\nOutput: Overflow Probability %"]
        Atlas["MongoDB Atlas Cloud\nPersistent Telemetry & Historical Trends"]
        Memory["Resilient In-Memory Ring Buffer\nZero-Downtime Fallback"]
        
        Sim --> API
        OM --> API
        API --> ML
        API --> Atlas
        API --> Memory
    end

    subgraph AI_Intelligence ["🧠 Layer 4: GenAI Disaster Advisory Engine"]
        Gemini["Google Gemini 2.5 Flash"]
        PromptEng["3-Step Municipal Protocol:\n1. Precise Intersections & Police Barricades\n2. Elevated Safe Haven Navigation Corridors\n3. Citizen Safety Directives & DRF Helpline"]
        ML -->|Score >= 70% or Depth >= 180cm| PromptEng
        PromptEng --> Gemini
    end

    subgraph Alert_Dispatch ["🚨 Layer 5: Multi-Carrier Siren & Dispatch Grid"]
        Twilio["Twilio Telephony Dispatch Engine"]
        SMS["Cellular SMS Alert\n(First Responder Mobile)"]
        WA["WhatsApp Broadcast Siren\n(GHMC / DRF Command Groups)"]
        Cooldown["Duplicate Suppressor\n(10-Minute Sliding Window Cache)"]

        Gemini --> Cooldown
        Cooldown --> Twilio
        Twilio --> SMS
        Twilio --> WA
    end

    subgraph Frontend_GIS ["🖥️ Layer 6: React 19 GIS Command Center"]
        UI["Modern Glassmorphism UI\n(Vite + Tailwind CSS)"]
        Map["Leaflet GIS Map\n• Color-Coded Depth Nodes\n• Designated Safe Shelters\n• Evacuation Route Vectors"]
        Charts["Recharts Historical Trajectories\n(Last 20 Telemetry Readings)"]
        Nepal["2024 Nepal Flood Explorer\nKathmandu Basin & Satellite Radar"]
        Storm["Cloudburst Simulation Sandbox\n(Instant Surge Injector)"]

        API -.->|JSON Streaming| UI
        UI --> Map
        UI --> Charts
        UI --> Nepal
        UI --> Storm
    end
```

---

## 🔄 Disaster Lifecycle & Emergency Pipeline

```mermaid
sequenceDiagram
    autonumber
    participant Sensor as 📡 IoT Drain Sensor
    participant Backend as ⚙️ FastAPI Core Engine
    participant Weather as 🌦️ Open-Meteo API
    participant ML as 🧠 Random Forest Model
    participant Gemini as 🤖 Google Gemini 2.5 Flash
    participant Twilio as 🚨 Twilio Siren Gateway
    participant Responder as 📱 Municipal First Responders
    participant Dashboard as 🖥️ GIS Command Center

    loop Every 3 Seconds
        Sensor->>Backend: Stream Clearance (cm), Depth (cm), Battery, Signal RSSI
        Backend->>Dashboard: Broadcast Real-Time Node Status
    end

    Note over Sensor,Backend: Cloudburst Surge Event Injected (Depth > 180cm)
    Weather->>Backend: Ingest Precipitation (35 mm/hr) & Humidity (85%)
    Backend->>ML: Run Inference [Depth, Precip, Humidity, Temp]
    ML-->>Backend: ML Risk Score: 94.8% (CRITICAL_OVERFLOW)
    
    Backend->>Gemini: Request Bilingual 3-Step Emergency Action Protocol
    Gemini-->>Backend: Synthesized Barricades, Navigation Routes & Helpline
    
    Backend->>Twilio: Dispatch SMS & WhatsApp Siren
    Twilio->>Responder: 🚨 CRITICAL FLOOD ALERT + Evacuation Directive
    
    Backend->>Dashboard: Render Critical Flashing Marker & Trigger Evacuation Path
```

---

## ✨ Key Features & Capabilities

### 1. 🛰️ Interactive GIS Command Center
* **Live Node Cartography:** Color-coded pinpoints dynamically shift across **Normal** (Green), **Warning** (Amber), and **Critical** (Red) based on live drainage clearance.
* **Safe Shelter Safe Havens:** Pre-computed high-ground evacuation shelters (e.g., *GHMC Community Halls, Elevated Transit Shelters*) with interactive route bearings.
* **Trajectory Line Graphs:** Real-time water depth trend curves over the last 20 readings with predictive capacity ceilings ($250\text{ cm}$).

### 2. 🧠 Dual-Tier Predictive Intelligence
* **Statistical ML Risk Classification:** A Scikit-Learn **Random Forest Classifier** trained on multi-variable environmental telemetry calculates real-time overflow probability percentages.
* **Generative AI Action Plans (Gemini 2.5 Flash):** On-demand and automatic synthesis of precise, 3-step action plans:
  1. **Exact Barricade Coordinates:** Street intersections to seal off within 300m.
  2. **Elevated Safe Zone Route:** Safe, non-submerged paths to the nearest shelter.
  3. **Citizen Advisory & Emergency Broadcast:** GHMC DRF (`040-21111111`) and Police (`100`) contacts in English and Hindi.

### 3. 🚨 Multi-Carrier Siren Gateway
* **Automated Twilio Dispatch:** High-priority cellular SMS and WhatsApp sirens delivered directly to disaster response teams when water clearance drops below critical thresholds ($< 40\text{ cm}$).
* **Duplicate Suppression Cache:** Intelligent 10-minute sliding window cooldown prevents siren spamming while maintaining rapid fail-safe delivery.

### 4. 🏔️ 2024 Nepal Flash Flood Historical Analytics
* Dedicated historical explorer module analyzing the devastating **September 2024 Kathmandu Basin catastrophe**.
* Interactive hydrographs for the **Bagmati, Hanumante, and Bishnumati rivers**, cross-referencing DHM gauge telemetry, rainfall spikes ($240\text{ mm}$ in 24 hrs), and flood extent footprints.

### 5. ⛈️ Cloudburst Simulation Sandbox
* Instant interactive cloudburst surge injection to test end-to-end telemetry triggers, ML overflow escalation, siren dispatches, and baseline resets in real-time.

---

## 🛠️ Technology Stack

| Layer | Stack | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19, Vite, Vanilla CSS, Tailwind | High-performance reactive UI with glassmorphism design |
| **Mapping & Geospatial** | Leaflet.js, React-Leaflet | OpenStreetMap cartography, custom markers, vector overlays |
| **Data Visualization** | Recharts, Lucide Icons | Responsive SVG hydrographs, telemetry sparklines, status badges |
| **Backend API** | Python 3.11+, FastAPI, Uvicorn | Asynchronous high-throughput REST endpoints & background workers |
| **Predictive ML** | Scikit-Learn, NumPy | Multi-variable Random Forest Classifier for flood prediction |
| **Generative AI** | Google GenAI SDK (`gemini-2.5-flash`) | Disaster protocol synthesis & multi-lingual advisory generation |
| **Data Persistence** | MongoDB Atlas (Cloud) | Resilient hybrid cloud storage with in-memory zero-downtime fallback |
| **Siren Dispatches** | Twilio Messaging REST API | Cellular SMS and WhatsApp sandbox emergency siren alerts |
| **Atmospheric Ingestion** | Open-Meteo REST API | Live temperature, precipitation rate, and humidity telemetry |
| **Hosting & CI/CD** | Vercel (Frontend), Render (Backend) | Continuous automated deployment pipelines linked to GitHub `main` |

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | System health, ML model status, and background simulator heartbeat |
| `GET` | `/api/nodes/latest` | Real-time telemetry snapshot for all monitored drainage nodes |
| `GET` | `/api/nodes/{id}/history` | Historical depth and clearance telemetry logs (last 20 records) |
| `GET` | `/api/weather/live` | Live atmospheric rainfall rate, humidity, and ML risk forecast |
| `GET` | `/api/historical/nepal-2024` | Comprehensive hydrological records of the 2024 Nepal flood disaster |
| `POST` | `/api/ai/emergency-plan` | Generate Gemini 2.5 Flash 3-step evacuation and cordon directives |
| `POST` | `/api/alerts/send` | Trigger manual or automated SMS/WhatsApp alerts with cooldown checks |
| `POST` | `/api/simulate/cloudburst` | Inject a severe storm surge event into any chosen drainage node |
| `POST` | `/api/simulate/reset` | Restore telemetry back to safe baseline operational metrics |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# 1. Google Gemini AI API Key (Get free at https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# 2. MongoDB Atlas Connection URI (Optional: runs in-memory if empty)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# 3. Twilio SMS & WhatsApp Dispatch Credentials (Optional: for sirens)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+15550001234
MY_PHONE_NUMBER=+910000000000

# Twilio WhatsApp Sandbox
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
MY_WHATSAPP_NUMBER=whatsapp:+910000000000
```

---

## 🚀 Local Installation & Quickstart

### Prerequisites
* **Python 3.10+**
* **Node.js 18+ & npm**

### 1. Clone Repository
```bash
git clone https://github.com/chandrakanthGupta/HydroSheild.git
cd HydroSheild
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API will run at `http://127.0.0.1:8000` (Docs at `http://127.0.0.1:8000/docs`).*

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Run Vite development server
npm run dev
```
*Frontend interface will run at `http://localhost:5173`.*

---

## 👥 Hackathon Team & Project Info

* **Project:** HydroSheild — Autonomous Urban Flood Monitoring & AI Dispatch Grid
* **Hackathon Track:** Disaster Tech / AI for Good / Smart Cities
* **Repository:** [https://github.com/chandrakanthGupta/HydroSheild](https://github.com/chandrakanthGupta/HydroSheild)
* **License:** MIT License
