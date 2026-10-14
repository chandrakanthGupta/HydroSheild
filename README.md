# 🌊 HydroSheild — Autonomous Urban Flood Monitoring & AI Dispatch Grid

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb)
![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini%202.5--Flash-8E75B2?logo=google)

> **Live Demo:** [https://hydro-sheild.vercel.app](https://hydro-sheild.vercel.app)  
> **API Server:** [https://hydrosheild.onrender.com](https://hydrosheild.onrender.com)

---

## 📌 Project Overview
HydroSheild is a real-time, AI-driven disaster response and urban flood prediction system built specifically for high-risk drainage infrastructure in metropolitan regions like Hyderabad.

It continuously ingests live IoT water clearance metrics, cross-references atmospheric rainfall rates, and runs predictive overflow modeling to generate location-specific emergency dispatch protocols via Google Gemini 2.5 Flash and Twilio SMS.

---

## ✨ Key Features
* **24/7 Cloud Telemetry Stream:** Automated asynchronous background workers stream live water clearance metrics across high-risk urban bottlenecks every 3 seconds.
* **Predictive Risk Modeling:** Integrates live Open-Meteo rainfall intensity data ($mm/hr$) to calculate estimated time-to-overflow before flooding occurs.
* **Generative AI Emergency Protocols:** Leverages Google Gemini 2.5 Flash to automatically draft 3-step traffic detour, police cordoning, and citizen advisory protocols.
* **Multi-Carrier SMS Dispatch:** Triggers instant SMS alerts via Twilio to first responders upon detecting critical depth levels or simulated storm surges.
* **Interactive GIS Command Center:** Features Leaflet geospatial mapping, real-time status badges, and historical depth trajectory line charts.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Leaflet, Recharts, Lucide Icons, Vite |
| **Backend** | Python, FastAPI, Asyncio, Uvicorn |
| **Generative AI** | Google Gemini API (`gemini-2.5-flash`) |
| **Database** | MongoDB Atlas (Cloud Cluster) |
| **Alerting System** | Twilio Messaging API |
| **Meteorology API** | Open-Meteo REST API |
| **Deployment** | Vercel (Frontend), Render (Backend) |
