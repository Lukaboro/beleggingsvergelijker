from fastapi import APIRouter, HTTPException
from app.core.supabase_client import supabase
import logging

router = APIRouter(tags=["banks"])

@router.get("/")
async def get_all_banks():
    """Haal alle aanbieders op uit de database"""
    try:
        # Query de aanbieders tabel
        banks = await supabase.select("aanbieders", "*")
        
        return {
            "success": True,
            "count": len(banks),
            "data": banks
        }
    
    except Exception as e:
        logging.error(f"Error bij ophalen aanbieders: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{bank_id}")
async def get_bank_by_id(bank_id: int):
    """Haal specifieke aanbieder op via ID"""
    try:
        banks = await supabase.select("aanbieders", f"*&aanbieder_id=eq.{bank_id}")
        
        if not banks:
            raise HTTPException(status_code=404, detail="Aanbieder niet gevonden")
            
        return {
            "success": True,
            "data": banks[0]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error bij ophalen aanbieder {bank_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{bank_id}")
async def get_bank_by_id(bank_id: int):
    """Haal specifieke bank op via ID"""
    try:
        # FIX: gebruik aanbieder_id in plaats van id
        banks = await supabase.select("aanbieders", f"*&aanbieder_id=eq.{bank_id}")
        
        if not banks:
            raise HTTPException(status_code=404, detail="Bank niet gevonden")
            
        return {
            "success": True,
            "data": banks[0]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error bij ophalen bank {bank_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")