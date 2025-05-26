import httpx
from dotenv import load_dotenv
import os
import logging

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

class SupabaseClient:
    def __init__(self):
        self.base_url = f"{SUPABASE_URL}/rest/v1"
        self.headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
    
    async def select(self, table: str, query: str = "*"):
        url = f"{self.base_url}/{table}?select={query}"
        logging.info(f"Making request to: {url}")
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            
            logging.info(f"Response status: {response.status_code}")
            logging.info(f"Response text: {response.text}")
            
            if response.status_code != 200:
                raise Exception(f"HTTP {response.status_code}: {response.text}")
                
            return response.json()

# Create instance
supabase = SupabaseClient()