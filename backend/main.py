# backend/main.py

from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import csv
import os
from datetime import datetime
from app.utils.matcher import calculate_bank_scores
from app.utils.pdf_generator import generate_report
from app.api.banks import router as banks_router
from app.api.tables import router as tables_router
from app.api.matching import router as matching_router
from app.api.ai_report import router as ai_report_router
from app.api.reports import router as reports_router

app = FastAPI(title="Beleggingspartner Vergelijker API")

# CORS middleware voor lokale ontwikkeling (SINGLE!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Voor productie zet dit op de specifieke origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Zorg ervoor dat de reports directory bestaat
os.makedirs("reports", exist_ok=True)

# Register API routers (CLEAN ORDER!)
app.include_router(banks_router, prefix="/api")
app.include_router(tables_router, prefix="/api/tables") 
app.include_router(matching_router, prefix="/api")
app.include_router(ai_report_router, prefix="/api")  # ✅ This should work now!
app.include_router(reports_router, prefix="/api/reports")

# Mount static files AFTER routers
app.mount("/api/static", StaticFiles(directory="reports"), name="static_reports")

@app.get("/")
async def root():
    return {"message": "Beleggingspartner Vergelijker API is running"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

class UserPreferences(BaseModel):
    investment_goal: str
    investment_horizon: str
    management_style: str
    preference: str
    amount: Optional[int] = 0

class LeadInfo(BaseModel):
    email: str
    name: Optional[str] = None
    interest_in_guidance: bool = False
    preferences: UserPreferences

@app.post("/api/match")
async def match_banks(preferences: UserPreferences):
    """
    Find matching banks based on user preferences
    """
    matches = calculate_bank_scores(preferences.dict())
    return {"matches": matches}

@app.post("/api/generate-report")
async def create_report(preferences: UserPreferences, request: Request):
    """
    Generate a dummy report based on user preferences
    """
    matches = calculate_bank_scores(preferences.dict())
    report_path = generate_report(preferences.dict(), matches)
    
    # Genereer volledige URL
    base_url = str(request.base_url).rstrip('/')  # e.g. http://localhost:8000 of https://beleggingsvergelijker.onrender.com
    report_url = f"{base_url}{report_path}"
    
    return {"report_url": report_url}

def save_lead_to_csv(lead: LeadInfo):
    """Background task to save lead information to CSV"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open("leads.csv", mode="a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([
            timestamp,
            lead.email,
            lead.name,
            lead.interest_in_guidance,
            lead.preferences.investment_goal,
            lead.preferences.investment_horizon,
            lead.preferences.management_style,
            lead.preferences.preference,
            lead.preferences.amount
        ])

@app.post("/api/submit-lead")
async def submit_lead(lead: LeadInfo, background_tasks: BackgroundTasks):
    """
    Save lead information and user preferences
    """
    background_tasks.add_task(save_lead_to_csv, lead)
    return {"status": "success", "message": "Bedankt voor je interesse!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)