from fastapi import APIRouter, HTTPException
from app.core.supabase_client import supabase
from app.api.matching import match_diensten_enhanced
import logging
import os
from typing import Dict, Any, List
from datetime import datetime
import anthropic

router = APIRouter(tags=["ai-report"])

# Initialize Claude client
claude_client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

@router.post("/generate-ai-report")
async def generate_ai_report(user_preferences: Dict[str, Any]):
    """
    Generate AI-powered personalized investment report using Claude
    """
    try:
        logging.info(f"Generating AI report for preferences: {user_preferences}")
        
        # 1. Get matches using existing enhanced matching
        matches_response = await match_diensten_enhanced(user_preferences)
        
        if not matches_response.get("success") or not matches_response.get("matches"):
            raise HTTPException(status_code=400, detail="No matches found for report generation")
        
        # 2. Build context for LLM
        context = build_report_context(matches_response, user_preferences)
        
        # 3. Generate report content with Claude
        report_content = await generate_claude_report(context)
        
        # 4. Generate PDF (disabled for now)
        # pdf_url = await generate_pdf_report(report_content, user_preferences)
        pdf_url = None  # Temporarily disabled
        
        return {
            "success": True,
            "report_url": pdf_url,  # Will be None
            "report_content": report_content,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logging.error(f"Error generating AI report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI report generation error: {str(e)}")

def build_report_context(matches_response: Dict[str, Any], user_preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Build comprehensive context for Claude to generate personalized report
    """
    matches = matches_response["matches"]
    
    # Extract user priorities and format them
    priorities = extract_user_priorities(user_preferences)
    
    # Analyze each match for detailed insights
    analyzed_matches = []
    for i, match in enumerate(matches):
        analysis = analyze_match_performance(match, priorities, rank=i+1)
        analyzed_matches.append(analysis)
    
    context = {
        "user_profile": {
            "investment_type": user_preferences.get("type_dienst"),
            "investment_amount": user_preferences.get("bedrag"),
            "priorities": priorities,
            "priority_summary": format_priority_summary(priorities)
        },
        "matches": analyzed_matches,
        "matching_metadata": {
            "total_found": matches_response.get("total_found", len(matches)),
            "filters_applied": matches_response.get("filters_applied", {})
        }
    }
    
    return context

def extract_user_priorities(user_preferences: Dict[str, Any]) -> Dict[str, str]:
    """Extract and normalize user priorities"""
    priority_mapping = {
        "kosten_belangrijkheid": "kosten",
        "duurzaamheid_belangrijkheid": "duurzaamheid", 
        "begeleiding_belangrijkheid": "persoonlijke_begeleiding",
        "functionaliteiten_belangrijkheid": "functionaliteiten",
        "rendement_belangrijkheid": "rendement"
    }
    
    priorities = {}
    for pref_key, priority_name in priority_mapping.items():
        importance = user_preferences.get(pref_key, "geen_voorkeur")
        priorities[priority_name] = importance
    
    return priorities

def format_priority_summary(priorities: Dict[str, str]) -> str:
    """Create human-readable priority summary"""
    high_priorities = [k for k, v in priorities.items() if v in ["heel_belangrijk", "zeer_belangrijk"]]
    medium_priorities = [k for k, v in priorities.items() if v == "belangrijk"]
    
    summary_parts = []
    if high_priorities:
        summary_parts.append(f"Hoge prioriteit: {', '.join(high_priorities)}")
    if medium_priorities:
        summary_parts.append(f"Gemiddelde prioriteit: {', '.join(medium_priorities)}")
    
    return "; ".join(summary_parts) if summary_parts else "Geen specifieke prioriteiten aangegeven"

def analyze_match_performance(match: Dict[str, Any], priorities: Dict[str, str], rank: int) -> Dict[str, Any]:
    """Analyze how well a match performs on user priorities"""
    details = match.get("details", {})
    scores = details.get("scores", {})
    weights = details.get("gewichten", {})
    
    # Analyze performance per priority
    priority_analysis = {}
    for priority, importance in priorities.items():
        if importance in ["heel_belangrijk", "zeer_belangrijk", "belangrijk"]:
            score = scores.get(priority, 5)  # Default to middle score
            weight = weights.get(priority, 0.05)
            
            # Determine performance level
            if score >= 8:
                performance = "uitstekend"
            elif score >= 6:
                performance = "goed"
            elif score >= 4:
                performance = "gemiddeld"
            else:
                performance = "ondergemiddeld"
            
            priority_analysis[priority] = {
                "score": score,
                "performance": performance,
                "importance": importance,
                "weight": weight
            }
    
    # Find strongest and weakest points
    strongest_points = [(k, v) for k, v in priority_analysis.items() if v["score"] >= 8]
    weakest_points = [(k, v) for k, v in priority_analysis.items() if v["score"] < 6 and v["importance"] != "geen_voorkeur"]
    
    return {
        "rank": rank,
        "name": match.get("name"),
        "match_score": match.get("matchScore"),
        "tco": details.get("tco"),
        "total_score": details.get("total_score"),
        "strengths": match.get("strengths", []),
        "weaknesses": match.get("weaknesses", []),
        "priority_analysis": priority_analysis,
        "strongest_points": strongest_points,
        "weakest_points": weakest_points,
        "key_insights": generate_match_insights(match, priority_analysis)
    }

def generate_match_insights(match: Dict[str, Any], priority_analysis: Dict[str, Any]) -> List[str]:
    """Generate key insights about this match"""
    insights = []
    
    # Check for trade-offs
    high_scores = [k for k, v in priority_analysis.items() if v["score"] >= 8]
    low_scores = [k for k, v in priority_analysis.items() if v["score"] < 6]
    
    if high_scores and low_scores:
        insights.append(f"Sterke trade-off: uitstekend in {', '.join(high_scores[:2])} maar zwakker in {', '.join(low_scores[:2])}")
    
    # Check for surprises (low priority but high score, or vice versa)
    for priority, analysis in priority_analysis.items():
        if analysis["importance"] == "geen_voorkeur" and analysis["score"] >= 8:
            insights.append(f"Onverwachte kracht: hoge score voor {priority} ondanks lage prioriteit")
        elif analysis["importance"] in ["heel_belangrijk", "zeer_belangrijk"] and analysis["score"] < 6:
            insights.append(f"Risico: lage score voor {priority} terwijl dit heel belangrijk voor u is")
    
    return insights

async def generate_claude_report(context: Dict[str, Any]) -> str:
    """Generate personalized report using Claude"""
    
    # Build the prompt
    prompt = build_claude_prompt(context)
    
    try:
        # Call Claude API
        response = claude_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            temperature=0.3,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        report_content = response.content[0].text
        logging.info("Successfully generated Claude report")
        return report_content
        
    except Exception as e:
        logging.error(f"Error calling Claude API: {str(e)}")
        # Fallback to template-based report
        return generate_fallback_report(context)

def build_claude_prompt(context: Dict[str, Any]) -> str:
    """
    Verbeterde prompt: meer persoonlijk, minder robotachtig, focus op trade-offs uitleggen
    """
    
    user_profile = context["user_profile"]
    matches = context["matches"]
    
    # Format matches met focus op trade-offs en waarom-verhaal
    matches_text = ""
    for match in matches:
        # Vertaal scores naar begrijpelijke taal (maar behoud cijfers voor verificatie)
        priority_insights = ""
        strong_areas = []
        weak_areas = []
        
        for priority, analysis in match["priority_analysis"].items():
            score = analysis['score']
            performance = analysis['performance']
            importance = analysis['importance']
            
            # Categoriseer prestaties
            if score >= 8:
                strong_areas.append(f"{priority} ({score:.1f})")
            elif score < 6 and importance in ["heel_belangrijk", "zeer_belangrijk"]:
                weak_areas.append(f"{priority} ({score:.1f})")
            
            priority_insights += f"  - {priority}: {performance} ({score:.1f}/10)\n"
        
        # Creëer waarom-verhaal
        why_story = ""
        if match["rank"] == 1:
            why_story = "Deze match kwam als beste naar voren omdat "
            if strong_areas:
                why_story += f"het uitstekend scoort op {', '.join(strong_areas[:2])}"
                if weak_areas:
                    why_story += f", ondanks gemiddelde prestaties bij {', '.join(weak_areas[:1])}"
            why_story += "."
        else:
            why_story = f"Op plaats {match['rank']} omdat het sterke punten heeft maar niet op alle vlakken kan concurreren met de nummer 1."
        
        matches_text += f"""
**{match['rank']}. {match['name']} - {match['match_score']}% match**
{why_story}

- Jaarlijkse kosten: {match['tco']:.2%} van uw inleg
- Wat ze goed doen: {', '.join(match['strengths'][:3])}
- Aandachtspunten: {', '.join(match['weaknesses'][:2]) if match['weaknesses'] else 'Geen significante zwakke punten geïdentificeerd'}

Hoe ze scoren op uw prioriteiten:
{priority_insights}
{f"Key insights: {'; '.join(match['key_insights'][:2])}" if match['key_insights'] else ""}
"""

    # Detect close race voor trade-off emphasis
    is_close_race = False
    if len(matches) >= 2:
        top_two_diff = matches[0]['match_score'] - matches[1]['match_score']
        is_close_race = top_two_diff <= 5  # 5% of minder verschil
    
    close_race_intro = ""
    if is_close_race:
        close_race_intro = f"""
**BELANGRIJKE OBSERVATIE:** De top 2 matches liggen heel dicht bij elkaar ({matches[0]['name']} {matches[0]['match_score']}% vs {matches[1]['name']} {matches[1]['match_score']}%). Dit betekent dat kleine verschillen in uw prioriteiten grote impact kunnen hebben op de beste keuze.
"""

    prompt = f"""We zijn het onafhankelijke team van BeleggingsTinder en hebben uw voorkeuren grondig geanalyseerd. Hieronder leggen we uit wat we hebben gevonden en waarom deze matches bij u passen.

**UW PROFIEL:**
- Gewenste aanpak: {user_profile['investment_type']}
- Te beleggen bedrag: €{user_profile['investment_amount']:,}
- Wat voor u belangrijk is: {user_profile['priority_summary']}

{close_race_intro}

**ONZE TOP 3 AANBEVELINGEN VOOR U:**
{matches_text}

**UW OPDRACHT:**
Schrijf een helder, persoonlijk rapport (800-1000 woorden) waarin je verklaart:

1. **Onze bevindingen** (150 woorden)
   - Begin met: "We hebben voor u gekeken naar de Belgische beleggingsmarkt..."
   - Leg kort uit wat opviel in uw specifieke situatie
   - Benoem eventuele trade-offs die we tegenkwamen

2. **Waarom deze 3 matches** (500 woorden)
   - Leg per partner uit WAAROM deze in de top 3 staat
   - Hoe verhoudt zich dit tot wat u belangrijk vindt?
   - Welke compromissen worden gemaakt en waarom dat OK is
   - Gebruik concrete scores maar vertaal ze: "uitstekend (8.2)" wordt "uitstekend"
   - Focus op verschillen die ertoe doen voor deze gebruiker

3. **Wat dit voor u betekent** (200 woorden)
   - Praktische implicaties van de verschillen
   - Waar u op moet letten bij uw keuze
   - Geen aanbevelingen, wel inzichten

**SCHRIJFSTIJL:**
- Professioneel maar toegankelijk (zoals een goede onafhankelijke adviseur)
- "We hebben gekeken..." / "Voor u betekent dit..." / "Uw prioriteiten..."
- Concrete voorbeelden en cijfers, maar vertaal jargon
- Leg uit waarom trade-offs logisch zijn
- GEEN bulletpoints - schrijf in vloeiende tekst
- Gebruik Nederlandse aanspreekvorm "u" en "uw"

**BELANGRIJK:**
- Leg uit waarom imperfecte matches toch bovenaan staan
- Maak trade-offs concreet: "Hoewel X duurder is, compenseert het dit door..."
- Bereid voor op vervolgvragen over prioriteiten
- Wees eerlijk over beperkingen maar positief over oplossingen

Begin met: "We hebben voor u naar de Belgische beleggingsmarkt gekeken en..."

**CONTEXT VOOR BELGISCHE MARKT:**
Focus op Belgische beleggingspartners en hun eigenheid. Spreek over kosten in context van Belgische belastingen en regelgeving waar relevant."""

    return prompt

def generate_fallback_report(context: Dict[str, Any]) -> str:
    """Generate template-based report if Claude API fails"""
    user_profile = context["user_profile"]
    matches = context["matches"]
    
    report = f"""
# Persoonlijk Beleggingsrapport

## Samenvatting
Op basis van uw voorkeuren voor {user_profile['investment_type']} met een bedrag van €{user_profile['investment_amount']:,}, hebben we drie beleggingspartners gevonden die goed bij uw profiel passen.

## Uw Top 3 Matches

"""
    
    for match in matches:
        report += f"""
### {match['rank']}. {match['name']} - {match['match_score']}% match

**Kosten:** {match['tco']:.2%} per jaar
**Sterke punten:** {', '.join(match['strengths'][:3])}
**Aandachtspunten:** {', '.join(match['weaknesses'][:2]) if match['weaknesses'] else 'Geen specifieke zwaktes geïdentificeerd'}

"""
    
    report += """
## Volgende stappen
1. Bekijk de gedetailleerde informatie van elke partner
2. Neem contact op voor een persoonlijk gesprek
3. Vergelijk de voorwaarden en services

Dit rapport is gegenereerd op basis van uw aangegeven voorkeuren en dient ter informatie.
"""
    
    return report

@router.post("/generate-ai-insights")
async def generate_ai_insights(request_data: Dict[str, Any]):
    """
    Generate quick AI insights for Results page preview
    Lighter version of full report for faster loading
    """
    try:
        print("🔥🔥🔥 AI INSIGHTS ENDPOINT CALLED!")
        print(f"📊 Request data: {request_data}")
        
        user_preferences = request_data
        matches = request_data.get("matches", [])
        
        print(f"🎯 User preferences: {user_preferences}")
        print(f"🏦 Matches count: {len(matches)}")
        print(f"🏦 Matches data: {matches}")
        
        if not matches:
            print("⚠️ No matches provided, getting from enhanced matching...")
            # Get matches if not provided
            matches_response = await match_diensten_enhanced(user_preferences)
            matches = matches_response.get("matches", [])[:3]  # Top 3 only
            print(f"🔄 Got {len(matches)} matches from enhanced matching")
        
        # Build lightweight context
        print("🏗️ Building insights context...")
        insights_context = build_insights_context(matches, user_preferences)
        print(f"🏗️ Context built: {insights_context}")
        
        # Check if context is valid
        if not insights_context:
            print("❌ Empty context, using default insights")
            return {
                "success": True,
                "insights": generate_default_insights()
            }
        
        # Generate quick insights with Claude
        print("🤖 Generating Claude insights...")
        insights = await generate_claude_insights(insights_context)
        print(f"✅ Final insights: {insights}")
        
        return {
            "success": True,
            "insights": insights
        }
        
    except Exception as e:
        print(f"❌ ERROR in generate_ai_insights: {str(e)}")
        import traceback
        traceback.print_exc()

        return {
            "success": True,
            "insights": generate_fallback_insights(matches if 'matches' in locals() else [], user_preferences if 'user_preferences' in locals() else {})
        }


def build_insights_context(matches: List[Dict[str, Any]], user_preferences: Dict[str, Any]) -> Dict[str, Any]:
    """Build lightweight context for quick insights with detailed analysis"""
    
    if not matches:
        return {}
    
    # Get user priorities
    priorities = extract_user_priorities(user_preferences)
    high_priorities = [k for k, v in priorities.items() if v in ["heel_belangrijk", "zeer_belangrijk"]]
    medium_priorities = [k for k, v in priorities.items() if v == "belangrijk"]
    
    # Analyze all top 3 matches for comparison
    match_analysis = []
    for i, match in enumerate(matches[:3]):
        details = match.get("details", {})
        scores = details.get("scores", {})
        
        # Analyze priority performance
        priority_scores = {}
        for priority in high_priorities + medium_priorities:
            score = scores.get(priority, 5.0)
            priority_scores[priority] = {
                "score": score,
                "performance": "uitstekend" if score >= 8 else "goed" if score >= 7 else "gemiddeld" if score >= 5 else "zwak"
            }
        
        match_analysis.append({
            "name": match.get("name"),
            "rank": i + 1,
            "match_score": match.get("matchScore", 0),
            "tco": details.get("tco", 0),
            "priority_scores": priority_scores,
            "strengths": match.get("strengths", [])[:2],  # Top 2 strengths
            "weaknesses": match.get("weaknesses", [])[:2]  # Top 2 weaknesses
        })
    
    # Find interesting patterns
    patterns = analyze_match_patterns(match_analysis, priorities)
    
    # Compare top matches
    comparison_insights = []
    if len(matches) >= 2:
        top_match, second_match = match_analysis[0], match_analysis[1]
        score_diff = top_match["match_score"] - second_match["match_score"]
        
        if score_diff < 3:
            comparison_insights.append(f"Zeer close race: {top_match['name']} ({top_match['match_score']}%) vs {second_match['name']} ({second_match['match_score']}%)")
        elif score_diff < 8:
            comparison_insights.append(f"Duidelijke winnaar: {top_match['name']} scoort {score_diff}% hoger dan {second_match['name']}")
        else:
            comparison_insights.append(f"Grote kloof: {top_match['name']} scoort veel hoger ({score_diff}% verschil)")
        
        # Compare costs
        if top_match["tco"] and second_match["tco"]:
            cost_diff = (top_match["tco"] - second_match["tco"]) * 100
            if abs(cost_diff) > 0.2:
                cheaper_name = top_match["name"] if top_match["tco"] < second_match["tco"] else second_match["name"]
                comparison_insights.append(f"Kostenverschil: {cheaper_name} is {abs(cost_diff):.2f}% goedkoper per jaar")
    
    return {
        "user_priorities": {
            "high": high_priorities,
            "medium": medium_priorities
        },
        "matches": match_analysis,
        "patterns": patterns,
        "comparison_insights": comparison_insights,
        "investment_amount": user_preferences.get("bedrag", 0)
    }

def analyze_match_patterns(matches: List[Dict], priorities: Dict[str, str]) -> Dict[str, Any]:
    """Analyze patterns across matches"""
    
    patterns = {
        "cost_leaders": [],
        "priority_leaders": {},
        "trade_offs": [],
        "surprising_performers": []
    }
    
    # Find cost leader
    matches_with_costs = [m for m in matches if m.get("tco")]
    if matches_with_costs:
        cost_leader = min(matches_with_costs, key=lambda x: x["tco"])
        patterns["cost_leaders"].append(f"{cost_leader['name']} heeft de laagste kosten ({cost_leader['tco']*100:.2f}%/jaar)")
    
    # Find leaders per priority
    for priority in priorities.keys():
        if priority in ["heel_belangrijk", "zeer_belangrijk", "belangrijk"]:
            priority_scores = [(m["name"], m["priority_scores"].get(priority, {}).get("score", 0)) for m in matches]
            if priority_scores:
                best_match = max(priority_scores, key=lambda x: x[1])
                if best_match[1] >= 7:
                    patterns["priority_leaders"][priority] = f"{best_match[0]} scoort het beste op {priority} ({best_match[1]:.1f}/10)"
    
    # Find trade-offs (high in one area, low in another)
    for match in matches:
        high_scores = [(p, s["score"]) for p, s in match["priority_scores"].items() if s["score"] >= 8]
        low_scores = [(p, s["score"]) for p, s in match["priority_scores"].items() if s["score"] < 6]
        
        if high_scores and low_scores:
            high_area = high_scores[0][0]
            low_area = low_scores[0][0]
            patterns["trade_offs"].append(f"{match['name']}: uitstekend in {high_area} maar zwakker in {low_area}")
    
    return patterns

def build_insights_prompt(context: Dict[str, Any]) -> str:
    """Build human-centered prompt for team-style insights"""
    
    print(f"🔍 DEBUG - Context received: {context}")
    
    matches = context.get("matches", [])
    patterns = context.get("patterns", {})
    priorities = context.get("user_priorities", {})
    comparison_insights = context.get("comparison_insights", [])
    investment_amount = context.get("investment_amount", 0)
    
    print(f"🔍 DEBUG - Matches: {len(matches) if matches else 0}")
    print(f"🔍 DEBUG - Patterns: {patterns}")
    print(f"🔍 DEBUG - Priorities: {priorities}")
    print(f"🔍 DEBUG - Investment amount: {investment_amount}")
    
    if not matches:
        print("❌ DEBUG - No matches, returning fallback prompt")
        return "Geen matchdata beschikbaar voor analyse."
    
    print("🏗️ DEBUG - Building match details...")
    
    # Format match details with human context
    match_details = ""
    for match in matches:
        print(f"🏦 DEBUG - Processing match: {match}")
        
        priority_performance = ""
        priority_scores = match.get("priority_scores", {})
        
        for priority, data in priority_scores.items():
            performance_word = data.get('performance', 'onbekend')
            if performance_word == "uitstekend":
                performance_word = "zeer sterk"
            elif performance_word == "goed":
                performance_word = "redelijk goed"
            elif performance_word == "gemiddeld":
                performance_word = "niet bijzonder sterk"
            elif performance_word == "zwak":
                performance_word = "zwakker dan verwacht"
            
            priority_performance += f"    - {priority}: {performance_word}\n"
        
        tco = match.get('tco', 0)
        tco_euro = tco * investment_amount if tco and investment_amount else 0
        strengths = match.get('strengths', [])
        weaknesses = match.get('weaknesses', [])
        
        match_details += f"""
{match.get('rank', '?')}. {match.get('name', 'Onbekende aanbieder')}
   - Jaarlijkse kosten: ongeveer €{tco_euro:.0f} (dat is {tco*100:.1f}% van uw inleg)
   - Waar ze goed in zijn: {', '.join(strengths[:2]) if strengths else 'Algemeen solide'}
   - Waar ze minder sterk zijn: {', '.join(weaknesses[:1]) if weaknesses else 'Geen grote zwaktes'}
   - Hoe ze presteren op wat u belangrijk vindt:
{priority_performance}
"""
    
    print(f"🏗️ DEBUG - Match details built: {match_details[:200]}...")
    
    # Extract key insights for human explanation
    top_match = matches[0] if matches else {}
    second_match = matches[1] if len(matches) > 1 else {}
    
    # Calculate practical cost differences
    cost_diff_euros = 0
    if top_match.get('tco') and second_match.get('tco') and investment_amount:
        cost_diff_euros = abs(top_match['tco'] - second_match['tco']) * investment_amount
    
    # High priority analysis
    high_prio_text = ', '.join(priorities.get('high', [])) if priorities.get('high') else 'geen specifieke'
    medium_prio_text = ', '.join(priorities.get('medium', [])) if priorities.get('medium') else 'geen'
    
    prompt = f"""Je bent lid van het BeleggingsTinder team dat persoonlijk uitlegt wat jullie hebben ontdekt.

CONTEXT VAN DEZE KLANT:
- Gaat €{investment_amount:,} beleggen via een Belgische partner
- Vindt vooral belangrijk: {high_prio_text}
- Vindt ook belangrijk: {medium_prio_text}

WAT JULLIE HEBBEN GEVONDEN:
{match_details}

JULLIE OPDRACHT:
Schrijf 3 korte, persoonlijke uitleg-stukjes alsof jullie team dit mondeling vertelt aan de klant. 
Geen AI-jargon, geen scores, gewoon uitleggen wat jullie zagen.

FORMAAT (elk 40-60 woorden):

1. **Belangrijkste bevinding:**
Begin met: "We zagen dat..." 
Leg uit wat het meest opviel toen jullie gingen zoeken voor deze klant.
Gebruik euro-bedragen waar relevant (bijv. "dat scheelt u €{cost_diff_euros:.0f} per jaar").

2. **Keuze-dilemma:**
Begin met: "Voor u komt het neer op..." 
Leg uit welke afweging deze klant moet maken tussen de opties.
Maak het praktisch: wat betekent dit in de dagelijkse ervaring?

3. **Wat opviel bij uw prioriteiten:**
Begin met: "Opvallend was dat..." 
Leg uit hoe de matches presteren op wat deze klant belangrijk vindt.
Wees eerlijk als er geen perfecte match is.

STIJL:
- Alsof jullie dit persoonlijk uitleggen aan een vriend
- Gebruik "we", "jullie hebben", "voor u"
- Praktische taal, geen technische termen
- Menselijk en begrijpelijk
- Belgische markt context waar relevant"""

    print(f"✅ DEBUG - Final prompt built, length: {len(prompt)}")
    return prompt
    
async def generate_claude_insights(context: Dict[str, Any]) -> Dict[str, str]:
    """Generate quick insights using Claude with improved context"""
    
    if not context:
        return generate_default_insights()
    
    prompt = build_insights_prompt(context)
    
    # ADD DEBUG LOG
    print(f"🔥 USING NEW INSIGHTS PROMPT! Length: {len(prompt)} chars")
    print(f"🔍 Prompt preview: {prompt[:200]}...")
    
    try:
        response = claude_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=800,  # INCREASED from 500!
            temperature=0.3,
            messages=[
                {
                    "role": "user", 
                    "content": prompt
                }
            ]
        )
        
        insights_text = response.content[0].text
        print(f"🤖 Claude API response: {insights_text}")  # ADD DEBUG
        
        # Parse the structured response
        insights = parse_insights_response(insights_text)
        print(f"📊 Parsed insights: {insights}")  # ADD DEBUG
        return insights
        
    except Exception as e:
        print(f"❌ Error calling Claude for insights: {str(e)}")
        # Use fallback with the improved context
        return generate_fallback_insights_from_context(context)
    
def parse_insights_response(insights_text: str) -> Dict[str, str]:
    """Parse human-style insights from Claude response"""
    
    insights = {}
    
    # Try to extract the three sections based on new format
    lines = insights_text.strip().split('\n')
    current_section = None
    current_text = []
    
    for line in lines:
        line = line.strip()
        
        # Look for the three section headers
        if line.startswith('1.') and 'bevinding' in line.lower():
            if current_section and current_text:
                insights[current_section] = ' '.join(current_text).strip()
            current_section = 'key_insight'
            # Extract text after the header
            text_part = line.split(':', 1)[-1].strip() if ':' in line else ''
            current_text = [text_part] if text_part else []
        elif line.startswith('2.') and ('dilemma' in line.lower() or 'keuze' in line.lower()):
            if current_section and current_text:
                insights[current_section] = ' '.join(current_text).strip()
            current_section = 'trade_offs'
            text_part = line.split(':', 1)[-1].strip() if ':' in line else ''
            current_text = [text_part] if text_part else []
        elif line.startswith('3.') and ('opviel' in line.lower() or 'prioriteit' in line.lower()):
            if current_section and current_text:
                insights[current_section] = ' '.join(current_text).strip()
            current_section = 'priority_analysis'
            text_part = line.split(':', 1)[-1].strip() if ':' in line else ''
            current_text = [text_part] if text_part else []
        elif line and current_section:
            # Continue building current section
            current_text.append(line)
    
    # Add final section
    if current_section and current_text:
        insights[current_section] = ' '.join(current_text).strip()
    
    # Fallback if parsing failed
    if not insights:
        # Try simpler parsing - just split by numbers
        sections = insights_text.split('1.')
        if len(sections) > 1:
            full_text = sections[1]
            parts = full_text.split('2.')
            if len(parts) > 1:
                insights['key_insight'] = parts[0].strip().replace('**Belangrijkste bevinding:**', '').strip()
                remaining = parts[1]
                final_parts = remaining.split('3.')
                if len(final_parts) > 1:
                    insights['trade_offs'] = final_parts[0].strip().replace('**Keuze-dilemma:**', '').strip()
                    insights['priority_analysis'] = final_parts[1].strip().replace('**Wat opviel bij uw prioriteiten:**', '').strip()
    
    # Final fallback with human-style defaults
    if not insights:
        insights = {
            "key_insight": "We hebben uw voorkeuren doorgenomen en de beste opties voor u geselecteerd.",
            "trade_offs": "Voor u komt het vooral neer op de afweging tussen kosten en service niveau.",
            "priority_analysis": "Opvallend was dat uw prioriteiten goed aansluiten bij wat deze partners bieden."
        }
    
    return insights

def generate_fallback_insights(matches: List[Dict[str, Any]], user_preferences: Dict[str, Any]) -> Dict[str, str]:
    """Generate fallback insights without Claude"""
    
    if not matches:
        return generate_default_insights()
    
    top_match = matches[0]
    match_score = top_match.get("matchScore", 0)
    
    # Basic analysis
    if match_score >= 80:
        key_insight = f"Uw beste match ({top_match.get('name')}) scoort uitstekend met {match_score}% - een zeer sterke match!"
    elif match_score >= 70:
        key_insight = f"Uw beste match ({top_match.get('name')}) met {match_score}% past goed bij uw profiel."
    else:
        key_insight = f"Uw beste match ({top_match.get('name')}) scoort {match_score}%. Er zijn mogelijkheden voor verbetering."
    
    # Check for trade-offs
    strengths = top_match.get("strengths", [])
    weaknesses = top_match.get("weaknesses", [])
    
    if strengths and weaknesses:
        trade_offs = f"Uw beste match is sterk in {strengths[0]} maar heeft aandachtspunten bij {weaknesses[0]}."
    elif strengths:
        trade_offs = f"Uw beste match heeft sterke punten zoals {strengths[0]}."
    else:
        trade_offs = "De verschillende opties hebben elk hun eigen voor- en nadelen."
    
    return {
        "key_insight": key_insight,
        "trade_offs": trade_offs,
        "priority_analysis": "Uw prioriteiten zijn meegenomen in de matching algoritme voor de beste resultaten."
    }

def generate_fallback_insights_from_context(context: Dict[str, Any]) -> Dict[str, str]:
    """Generate fallback insights from context when Claude fails"""
    
    matches = context.get("matches", [])
    priorities = context.get("user_priorities", {})
    patterns = context.get("patterns", {})
    
    if matches:
        top_match = matches[0]
        match_name = top_match.get("name", "Uw beste match")
        match_score = top_match.get("match_score", 0)
        
        # Use pattern data for better insights
        key_insight = f"{match_name} scoort {match_score}% en past goed bij uw profiel."
        
        # Check for specific trade-offs from patterns
        trade_offs_list = patterns.get("trade_offs", [])
        if trade_offs_list:
            trade_offs = trade_offs_list[0]  # Use first trade-off found
        else:
            trade_offs = "Elke beleggingspartner heeft unieke sterke en zwakke punten."
        
        # Use priority leaders for analysis
        priority_leaders = patterns.get("priority_leaders", {})
        if priority_leaders and priorities.get("high"):
            priority_analysis = f"Uw prioriteiten scoren goed: {list(priority_leaders.values())[0]}"
        elif priorities.get("high"):
            priority_analysis = f"Uw prioriteiten ({', '.join(priorities['high'][:2])}) zijn meegenomen in de analyse."
        else:
            priority_analysis = "De matching is gebaseerd op alle beschikbare criteria."
        
        return {
            "key_insight": key_insight,
            "trade_offs": trade_offs,
            "priority_analysis": priority_analysis
        }
    
    return generate_default_insights()

def generate_default_insights() -> Dict[str, str]:
    """Generate default insights when no data available"""
    return {
        "key_insight": "We hebben beleggingspartners gevonden die aansluiten bij uw profiel.",
        "trade_offs": "Elke partner heeft unieke sterke punten en services die kunnen verschillen.",
        "priority_analysis": "De matches zijn gerangschikt op basis van uw aangegeven voorkeuren."
    }

def generate_pdf_report(report_content: str, user_preferences: Dict[str, Any]) -> str:
    # Generate PDF from report content - placeholder function
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    pdf_filename = f"beleggingsrapport_{timestamp}.pdf"
    
    # TODO: Replace with actual PDF generation logic
    # For example: create_pdf(report_content, output_path=filename)
    
    return f"/reports/{pdf_filename}"

# Voeg dit toe aan je ai_report.py (GEEN namen veranderen!)

@router.post("/recalculate-matches")
async def recalculate_matches(request_data: Dict[str, Any]):
    """
    Herbereken matches gebaseerd op iteratieve antwoorden
    Gebruikt bestaande match_diensten_enhanced functie
    """
    try:
        print("🔄 RECALCULATE MATCHES ENDPOINT CALLED!")
        print(f"📊 Request data: {request_data}")
        
        # Haal originele user preferences op
        original_preferences = request_data.get("original_preferences", {})
        impacts = request_data.get("impacts", [])
        
        print(f"🎯 Original preferences: {original_preferences}")
        print(f"💥 Impacts to apply: {impacts}")
        
        # Maak kopie van preferences om te modificeren
        modified_preferences = original_preferences.copy()
        
        # Pas impacts toe
        for impact in impacts:
            print(f"🔧 Applying impact: {impact}")
            
            for key, value in impact.items():
                if key.startswith('weight_'):
                    # Converteer weight naar importance level
                    priority_key = key.replace('weight_', '') + '_belangrijkheid'
                    
                    if value > 1.3:
                        modified_preferences[priority_key] = 'heel_belangrijk'
                        print(f"   ✅ Set {priority_key} to 'heel_belangrijk' (weight: {value})")
                    elif value > 1.1:
                        modified_preferences[priority_key] = 'zeer_belangrijk'
                        print(f"   ✅ Set {priority_key} to 'zeer_belangrijk' (weight: {value})")
                    elif value < 0.8:
                        modified_preferences[priority_key] = 'niet_belangrijk'
                        print(f"   ✅ Set {priority_key} to 'niet_belangrijk' (weight: {value})")
                    elif value < 0.9:
                        modified_preferences[priority_key] = 'geen_voorkeur'
                        print(f"   ✅ Set {priority_key} to 'geen_voorkeur' (weight: {value})")
                
                elif key == 'preferred_match':
                    # Voor toekomstige implementatie van match boosting
                    print(f"   📌 User preferred match: {value}")
                
                elif key == 'lower_thresholds':
                    # Verlaag drempelwaarden voor meer matches
                    print(f"   🔽 Lower thresholds requested: {value}")
                
                elif key == 'expand_scope':
                    # Breid zoekcriteria uit
                    print(f"   🔍 Expand scope requested: {value}")
                
                elif key == 'restart_wizard':
                    # Gebruiker wil wizard opnieuw starten
                    print(f"   🔄 Restart wizard requested: {value}")
                    return {
                        "success": True,
                        "action": "restart_wizard",
                        "message": "Gebruiker wil wizard opnieuw starten"
                    }
        
        print(f"🏁 Final modified preferences: {modified_preferences}")
        
        # Roep bestaande matching functie aan met gemodificeerde preferences
        print("🎯 Calling match_diensten_enhanced with modified preferences...")
        matches_response = await match_diensten_enhanced(modified_preferences)
        
        if not matches_response.get("success"):
            raise HTTPException(status_code=400, detail="Herberekening van matches mislukt")
        
        print(f"✅ Recalculation successful! Found {len(matches_response.get('matches', []))} matches")
        
        return {
            "success": True,
            "matches": matches_response.get("matches", []),
            "modified_preferences": modified_preferences,
            "applied_impacts": impacts,
            "total_found": matches_response.get("total_found", 0)
        }
        
    except Exception as e:
        print(f"❌ Error in recalculate_matches: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Herberekening error: {str(e)}")


def detect_scenario_backend(matches: List[Dict], user_preferences: Dict) -> Dict:
    """
    Backend versie van scenario detectie voor consistentie
    """
    if len(matches) < 2:
        return {"type": "insufficient_data", "scenario": None}
    
    top_match = matches[0]
    second_match = matches[1]
    
    top_score = top_match.get("matchScore", 0)
    second_score = second_match.get("matchScore", 0)
    score_diff = top_score - second_score
    
    # Close race detection
    if score_diff <= 5:
        return {
            "type": "close_race",
            "urgency": "high",
            "score_diff": score_diff,
            "top_match": top_match.get("name"),
            "second_match": second_match.get("name"),
            "scenario": f"Close race: {top_score}% vs {second_score}%"
        }
    
    # Low scores detection  
    if top_score < 75:
        return {
            "type": "low_scores", 
            "urgency": "medium",
            "top_score": top_score,
            "scenario": f"Lage scores: beste match scoort {top_score}%"
        }
    
    # High priority miss detection
    priorities = extract_user_priorities(user_preferences)
    high_priority_miss = None
    
    for priority, importance in priorities.items():
        if importance in ["heel_belangrijk", "zeer_belangrijk"]:
            details = top_match.get("details", {})
            scores = details.get("scores", {})
            score = scores.get(priority, 5.0)
            
            if score < 6.0:
                high_priority_miss = {
                    "priority": priority,
                    "importance": importance,
                    "score": score
                }
                break
    
    if high_priority_miss:
        return {
            "type": "priority_miss",
            "urgency": "high", 
            "missed_priority": high_priority_miss,
            "scenario": f"Prioriteit miss: {high_priority_miss['priority']} scoort {high_priority_miss['score']:.1f}"
        }
    
    # Default refinement
    return {
        "type": "refinement",
        "urgency": "low",
        "scenario": "Goede matches - verfijning mogelijk"
    }


@router.post("/detect-scenario")
async def detect_scenario_endpoint(request_data: Dict[str, Any]):
    """
    Endpoint voor frontend om scenario te detecteren
    Kan gebruikt worden voor debugging of expliciete scenario checks
    """
    try:
        matches = request_data.get("matches", [])
        user_preferences = request_data.get("user_preferences", {})
        
        scenario = detect_scenario_backend(matches, user_preferences)
        
        return {
            "success": True,
            "scenario": scenario
        }
        
    except Exception as e:
        print(f"❌ Error detecting scenario: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "scenario": {"type": "error", "urgency": "low"}
        }


# Hulpfunctie voor gewichten aanpassing (kan later uitgebreid worden)
def calculate_weight_adjustments(impacts: List[Dict]) -> Dict[str, float]:
    """
    Bereken gewichten aanpassingen gebaseerd op user impacts
    """
    weight_adjustments = {}
    
    for impact in impacts:
        for key, value in impact.items():
            if key.startswith('weight_'):
                priority = key.replace('weight_', '')
                
                # Accumuleer gewichten als er meerdere impacts zijn
                if priority in weight_adjustments:
                    weight_adjustments[priority] = (weight_adjustments[priority] + value) / 2
                else:
                    weight_adjustments[priority] = value
    
    return weight_adjustments


@router.get("/debug-iterative")
async def debug_iterative_system():
    """
    Debug endpoint om iteratieve systeem te testen
    """
    return {
        "endpoints": [
            "/recalculate-matches - Herbereken matches met impacts",
            "/detect-scenario - Detecteer scenario type", 
            "/debug-iterative - Deze debug info"
        ],
        "example_impact": {
            "weight_kosten": 1.5,
            "weight_begeleiding": 0.8,
            "preferred_match": "dienst_123"
        },
        "example_request": {
            "original_preferences": {
                "bedrag": 50000,
                "kosten_belangrijkheid": "belangrijk"
            },
            "impacts": [
                {"weight_kosten": 1.5, "preferred_match": "dienst_123"}
            ]
        }
    }