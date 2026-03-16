"""
Database Seeding Script
"""
from sqlalchemy.orm import Session
from src.models import Department, User, GridLane, SLARule
from src.models.base import SessionLocal
import structlog

logger = structlog.get_logger(__name__)

def seed_database():
    """Seed database with demo data"""
    db: Session = SessionLocal()

    try:
        # Check if data already exists
        existing_departments = db.query(Department).count()
        if existing_departments > 0:
            logger.info("Database already seeded, skipping...")
            return

        # Create departments
        departments_data = [
            {"name": "Electricity Department", "code": "ELECTRICITY"},
            {"name": "Water Supply Department", "code": "WATER"},
            {"name": "Roads & Transportation", "code": "ROADS"},
            {"name": "Health & Sanitation", "code": "HEALTH"},
            {"name": "Public Safety", "code": "SAFETY"}
        ]

        departments = []
        for dept_data in departments_data:
            dept = Department(**dept_data)
            db.add(dept)
            departments.append(dept)

        db.commit()

        # Create officers
        officers_data = [
            {"firebase_uid": "officer1", "name": "John Officer", "email": "john@gov.in", "role": "officer", "department_id": 1},
            {"firebase_uid": "officer2", "name": "Jane Officer", "email": "jane@gov.in", "role": "officer", "department_id": 2},
            {"firebase_uid": "admin1", "name": "Admin User", "email": "admin@gov.in", "role": "admin", "department_id": None}
        ]

        for officer_data in officers_data:
            officer = User(**officer_data)
            db.add(officer)

        db.commit()

        # Create grid lanes
        grid_lanes_data = [
            {"name": "Electricity Lighting", "department_id": 1, "keywords": "light, electricity, power, bulb, streetlight"},
            {"name": "Water Supply", "department_id": 2, "keywords": "water, leak, pipe, supply, drinking"},
            {"name": "Road Maintenance", "department_id": 3, "keywords": "road, pothole, street, traffic, repair"},
            {"name": "Health Services", "department_id": 4, "keywords": "health, medical, hospital, sanitation, waste"},
            {"name": "Public Safety", "department_id": 5, "keywords": "police, crime, safety, emergency, security"}
        ]

        for lane_data in grid_lanes_data:
            lane = GridLane(**lane_data)
            db.add(lane)

        # Create SLA rules
        sla_rules_data = [
            {"category": "Electricity", "priority": "high", "hours_to_resolve": 24, "department_id": 1},
            {"category": "Electricity", "priority": "medium", "hours_to_resolve": 48, "department_id": 1},
            {"category": "Water", "priority": "high", "hours_to_resolve": 12, "department_id": 2},
            {"category": "Roads", "priority": "medium", "hours_to_resolve": 72, "department_id": 3},
            {"category": "Health", "priority": "urgent", "hours_to_resolve": 2, "department_id": 4}
        ]

        for sla_data in sla_rules_data:
            sla = SLARule(**sla_data)
            db.add(sla)

        db.commit()

        logger.info("Database seeded successfully")

    except Exception as e:
        logger.error("Error seeding database", error=str(e))
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()