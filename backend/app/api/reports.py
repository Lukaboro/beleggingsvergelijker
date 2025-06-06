# backend/app/api/reports.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Dict, Any
from ..services.report_generator import ReportGenerator
import json

router = APIRouter()

class ReportRequest(BaseModel):
    user_data: Dict[str, Any]
    matches: List[Dict[str, Any]]
    claude_analysis: str

@router.get("/test-simple")
async def test_simple():
    """Simpele test zonder PDF generatie"""
    try:
        return {"status": "ok", "message": "Reports endpoint works"}
    except Exception as e:
        return {"error": str(e)}

@router.post("/debug-data")
async def debug_data(request: ReportRequest):
    """Debug endpoint om data te inspecteren"""
    try:
        print("🔍 DEBUG: Received data:")
        print(f"User data: {request.user_data}")
        print(f"Matches: {request.matches}")
        print(f"Claude analysis: {request.claude_analysis[:100]}...")
        
        return {
            "status": "ok",
            "user_data": request.user_data,
            "matches_count": len(request.matches),
            "claude_analysis_length": len(request.claude_analysis)
        }
    except Exception as e:
        print(f"🚨 Debug error: {str(e)}")
        return {"error": str(e)}

@router.get("/test-template")
async def test_template():
    """Test alleen template rendering"""
    try:
        from ..services.report_generator import ReportGenerator
        generator = ReportGenerator()
        
        # Dummy data
        dummy_data = {
            'user_profile': {'bedrag': 50000, 'type_dienst': 'Test'},
            'matches': [{'name': 'Test Bank', 'matchScore': 85, 'tco': 1000}],
            'claude_analysis': 'Test analysis',
            'generated_date': '04 June 2025',
            'weasyprint_available': True
        }
        
        html = generator._render_template(dummy_data)
        return HTMLResponse(content=html)
        
    except Exception as e:
        return {"error": str(e)}

@router.post("/generate-report")
async def generate_report(request: ReportRequest):
    """Genereer PDF rapport voor gebruiker (met HTML fallback)"""
    try:
        print("🔄 Starting report generation...")
        generator = ReportGenerator()
        
        print("🔄 Calling generator.generate_report...")
        content, media_type = await generator.generate_report(
            user_data=request.user_data,
            matches=request.matches,
            claude_analysis=request.claude_analysis,
            format="pdf"
        )
        
        print(f"✅ Report generated successfully, type: {media_type}")
        
        if media_type == "application/pdf":
            # PDF success
            return Response(
                content=content,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": "attachment; filename=beleggings_rapport.pdf"
                }
            )
        else:
            # HTML fallback
            return Response(
                content=content,
                media_type="text/html",
                headers={
                    "Content-Disposition": "inline; filename=beleggings_rapport.html"
                }
            )
        
    except Exception as e:
        print(f"🚨 Report generation error: {str(e)}")
        import traceback
        print(f"🚨 Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")

@router.get("/test-report")
async def test_report():
    """Test endpoint met sample data"""
    sample_data = {
        "user_data": {
            "bedrag": 50000,
            "type_dienst": "Vermogensbeheer",
            "kosten_belangrijkheid": "belangrijk"
        },
        "matches": [
            {
                "naam_aanbieder": "Keytrade Bank",
                "tco": 1250,
                "score": 8.5,
                "type_aanbod": "Vermogensbeheer"
            },
            {
                "naam_aanbieder": "BinckBank",
                "tco": 1450,
                "score": 7.8,
                "type_aanbod": "Vermogensbeheer"
            },
            {
                "naam_aanbieder": "ING",
                "tco": 1650,
                "score": 7.2,
                "type_aanbod": "Vermogensbeheer"
            }
        ],
        "claude_analysis": "Gebaseerd op uw profiel van €50.000 en voorkeur voor vermogensbeheer, is Keytrade Bank de beste match vanwege de lage kosten (slechts 2.5% TCO) en sterke track record."
    }
    
    request = ReportRequest(**sample_data)
    return await generate_report(request)