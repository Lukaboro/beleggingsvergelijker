# backend/app/services/report_generator.py
from fastapi import HTTPException
from fastapi.responses import HTMLResponse
from jinja2 import Environment, FileSystemLoader
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Voor server gebruik
import seaborn as sns
import io
import base64
from datetime import datetime
import os

# Try WeasyPrint import with fallback
try:
    from weasyprint import HTML, CSS
    WEASYPRINT_AVAILABLE = True
    print("✅ WeasyPrint successfully imported")
except ImportError as e:
    WEASYPRINT_AVAILABLE = False
    print(f"⚠️ WeasyPrint not available: {e}")
    print("📄 Will generate HTML reports instead")

class ReportGenerator:
    def __init__(self):
        # Template directory setup
        template_dir = os.path.join(os.path.dirname(__file__), '../templates')
        self.jinja_env = Environment(loader=FileSystemLoader(template_dir))
        
        # Styling setup
        plt.style.use('seaborn-v0_8' if hasattr(plt.style, 'seaborn-v0_8') else 'default')
        sns.set_palette("husl")
    
    async def generate_report(self, user_data: dict, matches: list, claude_analysis: str, format: str = "pdf"):
        """Hoofdfunctie voor rapport generatie"""
        try:
            # 1. Data voorbereiden
            report_data = self._prepare_report_data(user_data, matches, claude_analysis)
            
            # 2. Grafieken genereren
            charts = self._generate_charts(matches)
            report_data.update(charts)
            
            # 3. HTML template renderen
            html_content = self._render_template(report_data)
            
            # 4. PDF of HTML returneren
            if format == "pdf" and WEASYPRINT_AVAILABLE:
                pdf_bytes = self._generate_pdf(html_content)
                return pdf_bytes, "application/pdf"
            else:
                # Fallback naar HTML
                return html_content, "text/html"
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")
    
    def _prepare_report_data(self, user_data: dict, matches: list, claude_analysis: str) -> dict:
        """Prepareer alle data voor de template"""
        
        # Debug: print de matches data
        print("🔍 DEBUG: Preparing report data...")
        print(f"User data: {user_data}")
        print(f"Matches count: {len(matches)}")
        for i, match in enumerate(matches[:3]):
            print(f"Match {i+1}: {match}")
        print(f"Claude analysis: {claude_analysis[:100]}...")
        
        return {
            'user_profile': user_data,
            'matches': matches[:3],  # Top 3
            'claude_analysis': claude_analysis,
            'generated_date': datetime.now().strftime("%d %B %Y"),
            'total_matches': len(matches),
            'weasyprint_available': WEASYPRINT_AVAILABLE
        }
    
    def _generate_charts(self, matches: list) -> dict:
        """Genereer base64 encoded charts"""
        charts = {}
        
        # Kosten vergelijking chart
        if len(matches) >= 2:
            charts['cost_chart'] = self._create_cost_chart(matches)
        
        return charts
    
    def _create_cost_chart(self, matches: list) -> str:
        """Maak kosten vergelijking bar chart"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Verbeterde data extractie
        names = []
        costs = []
        
        for i, match in enumerate(matches[:3]):
            # Probeer verschillende velden voor naam
            name = (match.get('naam_aanbieder') or 
                   match.get('name') or 
                   match.get('aanbieder_naam') or 
                   f'Partij {i+1}')
            names.append(name[:15])
            
            # Probeer verschillende velden voor kosten
            cost = (match.get('tco') or 
                   match.get('totale_kosten') or 
                   match.get('kosten') or 
                   match.get('TCO') or 
                   0)
            
            # Als kosten 0 zijn, probeer een realistische schatting
            if cost == 0:
                bedrag = match.get('bedrag', 50000)
                cost = bedrag * 0.02  # 2% als fallback
            
            costs.append(cost)
        
        print(f"🎨 Chart data - Names: {names}, Costs: {costs}")
        
        # Alleen grafiek maken als we geldige data hebben
        if all(cost > 0 for cost in costs):
            bars = ax.bar(names, costs, color=['#2E8B57', '#4682B4', '#CD853F'])
            
            ax.set_title('Totale Kosten per Jaar (TCO)', fontsize=16, fontweight='bold')
            ax.set_ylabel('Kosten (€)', fontsize=12)
            ax.tick_params(axis='x', rotation=45)
            
            # Waarden op bars
            for bar, cost in zip(bars, costs):
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height + 10,
                       f'€{cost:,.0f}', ha='center', va='bottom', fontweight='bold')
            
            plt.tight_layout()
            
            # Convert to base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
            buffer.seek(0)
            chart_b64 = base64.b64encode(buffer.getvalue()).decode()
            plt.close()
            
            return f"data:image/png;base64,{chart_b64}"
        else:
            print("⚠️ No valid cost data for chart")
            plt.close()
            return None
    
    def _render_template(self, data: dict) -> str:
        """Render HTML template"""
        template = self.jinja_env.get_template('report_template.html')
        return template.render(**data)
    
    def _generate_pdf(self, html_content: str) -> bytes:
        """Convert HTML to PDF met WeasyPrint"""
        if not WEASYPRINT_AVAILABLE:
            raise Exception("WeasyPrint is not available")
        
        try:
            import logging
            # Disable WeasyPrint verbose logging
            logging.getLogger('weasyprint').setLevel(logging.ERROR)
            logging.getLogger('fontTools').setLevel(logging.ERROR)
            
            # Simple PDF generation without external CSS for now
            html_doc = HTML(string=html_content)
            pdf_bytes = html_doc.write_pdf()
            
            return pdf_bytes
            
        except Exception as e:
            print(f"🚨 WeasyPrint error: {str(e)}")
            raise Exception(f"WeasyPrint PDF generation failed: {str(e)}")