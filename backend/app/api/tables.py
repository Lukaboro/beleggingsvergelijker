from fastapi import APIRouter, HTTPException, Query
from app.core.supabase_client import supabase
import logging
from typing import Optional, List

router = APIRouter(prefix="/api/tables", tags=["tables"])

# Toegestane tabellen voor security - JUISTE NAMEN
ALLOWED_TABLES = {
    "aanbieders", "beheerstijl", "diensten", "functionaliteiten", 
    "kosten", "praktische_notities", "rendementen"
}

@router.get("/{table_name}")
async def get_table_data(
    table_name: str,
    select: str = Query("*", description="Kolommen om te selecteren"),
    limit: Optional[int] = Query(None, description="Aantal records"),
    offset: Optional[int] = Query(0, description="Offset voor paginatie"),
    filter_column: Optional[str] = Query(None, description="Kolom om te filteren"),
    filter_value: Optional[str] = Query(None, description="Waarde om te filteren")
):
    """Generieke API voor alle tabellen"""
    
    # Security check
    if table_name not in ALLOWED_TABLES:
        raise HTTPException(status_code=404, detail=f"Tabel '{table_name}' niet toegestaan")
    
    try:
        # Bouw query string
        query_params = f"select={select}"
        
        if filter_column and filter_value:
            query_params += f"&{filter_column}=eq.{filter_value}"
        
        if limit:
            query_params += f"&limit={limit}"
            
        if offset:
            query_params += f"&offset={offset}"
        
        # Execute query
        data = await supabase.select(table_name, query_params.replace("select=", ""))
        
        return {
            "success": True,
            "table": table_name,
            "count": len(data),
            "data": data
        }
    
    except Exception as e:
        logging.error(f"Error bij ophalen {table_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/")
async def get_available_tables():
    """Lijst van beschikbare tabellen"""
    return {
        "success": True,
        "available_tables": list(ALLOWED_TABLES),
        "examples": {
            "alle_diensten": "/api/tables/diensten",
            "beheerstijl_data": "/api/tables/beheerstijl",
            "kosten_filter": "/api/tables/kosten?filter_column=type&filter_value=beheerkosten",
            "eerste_10_aanbieders": "/api/tables/aanbieders?limit=10"
        }
    }