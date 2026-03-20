Analyze the following grievance text and extract the required information in JSON format.

Categories:
- WATER_SUPPLY: Pipe leaks, no water, contaminated water
- ROADS: Potholes, broken pavement, missing signs
- ELECTRICITY: Power outages, sparking wires, broken streetlights
- SANITATION: Garbage accumulation, blocked drains
- TRANSPORT: Bus delays, broken bus stops
- HEALTH: Clinic issues, medical emergencies
- POLICE: Safety concerns, traffic violations
- ENVIRONMENT: Noise pollution, illegal dumping

Priorities:
- MINOR: Aesthetic issues
- LOW: Non-urgent
- MODERATE: Standard issue
- HIGH: Urgent needing attention within 48 hours
- CRITICAL: Public safety hazard needing immediate attention

Departments:
WATER, PWD, ELECTRICITY, SANITATION, TRANSPORT, HEALTH, POLICE, ENVIRONMENT

Text: "{text}"

Return ONLY valid JSON in this exact format:
{
    "category": "category_name",
    "priority": "priority_level",
    "summary": "a short 1-sentence summary",
    "department": "department_name"
}
