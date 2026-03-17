# GrievanceGrid SOLID Principles

## Overview

The GrievanceGrid codebase follows SOLID principles to ensure modularity, testability, and maintainability. These guidelines are for the AI IDE to maintain code quality.

---

## Single Responsibility Principle (SRP)

### Definition
Each class, module, or function should have one reason to change.

### Implementation in GrievanceGrid

#### Good (SRP Compliant)
```python
# Separate services for different concerns

class GrievanceService:
    """Handles grievance CRUD operations"""
    def create(self, data: GrievanceDTO) -> Grievance:
        pass
    
    def update(self, id: str, data: GrievanceDTO) -> Grievance:
        pass
    
    def get_by_id(self, id: str) -> Grievance:
        pass

class SLAService:
    """Manages SLA timers and deadlines"""
    def create_timer(self, grievance_id: str, sla_type: SLAType) -> SLATimer:
        pass
    
    def check_escalation(self, timer_id: str) -> bool:
        pass
    
    def get_remaining_time(self, timer_id: str) -> timedelta:
        pass

class RoutingService:
    """Handles grievance routing to departments"""
    def determine_route(self, grievance: Grievance) -> Route:
        pass
    
    def assign_team(self, route: Route) -> Team:
        pass
```

#### Bad (Violates SRP)
```python
class GrievanceManager:  # Too many responsibilities
    def create(self, data): pass
    def calculate_sla(self, data): pass
    def route_to_department(self, data): pass
    def send_notification(self, data): pass
    def generate_report(self, data): pass  # This should be in ReportService
```

### AI IDE Rules
- If a file exceeds 300 lines, consider splitting
- If a class has more than 5 public methods, verify single responsibility
- Each service should only import from its layer and below

---

## Open/Closed Principle (OCP)

### Definition
Software entities should be open for extension but closed for modification.

### Implementation

#### Use Abstraction for Extension
```python
from abc import ABC, abstractmethod

class PriorityCalculator(ABC):
    @abstractmethod
    def calculate(self, grievance: Grievance) -> Priority:
        pass

class DefaultPriorityCalculator(PriorityCalculator):
    def calculate(self, grievance: Grievance) -> Priority:
        # Default logic
        return Priority.MEDIUM

# Add new priority logic without modifying existing code
class AIScorePriorityCalculator(PriorityCalculator):
    def calculate(self, grievance: Grievance) -> Priority:
        ai_score = grievance.ai_priority
        if ai_score > 0.8:
            return Priority.HIGH
        return Priority.MEDIUM
```

#### Strategy Pattern for Routing
```python
class RoutingStrategy(ABC):
    @abstractmethod
    def select_department(self, grievance: Grievance) -> Department:
        pass

class GNNRoutingStrategy(RoutingStrategy):
    def select_department(self, grievance: Grievance) -> Department:
        return self.gnn_model.predict(grievance)

class DistanceBasedRouting(RoutingStrategy):
    def select_department(self, grievance: Grievance) -> Department:
        # Find nearest department with capacity
        pass

# Configure at startup, extend by adding new strategies
routing_engine = RoutingEngine(strategy=GNNRoutingStrategy())
```

### AI IDE Rules
- Use interfaces/protocols for all external integrations
- Add new features via inheritance/composition, not modification
- Create adapters for third-party services (AI models, databases)

---

## Liskov Substitution Principle (LSP)

### Definition
Objects of a superclass should be replaceable with objects of a subclass without breaking the application.

### Implementation

#### Proper Inheritance
```python
class GrievanceRepository(ABC):
    @abstractmethod
    def save(self, grievance: Grievance) -> Grievance:
        pass
    
    @abstractmethod
    def find_by_id(self, id: str) -> Optional[Grievance]:
        pass

class PostgreSQLGrievanceRepository(GrievanceRepository):
    def save(self, grievance: Grievance) -> Grievance:
        # PostgreSQL-specific implementation
        return grievance
    
    def find_by_id(self, id: str) -> Optional[Grievance]:
        # PostgreSQL query
        pass

# Client code works with abstract type
class GrievanceService:
    def __init__(self, repository: GrievanceRepository):
        self.repository = repository
    
    def get(self, id: str) -> Grievance:
        return self.repository.find_by_id(id)  # Works with any implementation
```

#### Don't Weaken Preconditions
```python
# Base class
class GrievanceValidator:
    def validate(self, data: GrievanceInput) -> bool:
        return data.category is not None  # Allows any category

# Subclass - BAD, weakens precondition
class StrictGrievanceValidator(GrievanceValidator):
    def validate(self, data: GrievanceInput) -> bool:
        # This restricts more than base - violates LSP
        return data.category in ["ROADS", "WATER_SUPPLY"] and super().validate(data)
```

---

## Interface Segregation Principle (ISP)

### Definition
Clients should not be forced to depend on interfaces they do not use.

### Implementation

#### Fine-Grained Interfaces
```python
# Instead of one large interface, split into specific ones
class Creatable(Protocol):
    def create(self, data: dict) -> object: ...

class Updatable(Protocol):
    def update(self, id: str, data: dict) -> object: ...

class Deletable(Protocol):
    def delete(self, id: str) -> bool: ...

class Findable(Protocol):
    def find_by_id(self, id: str) -> object: ...

# Implement only what each service needs
class GrievanceService(Creatable, Updatable, Findable):
    # No delete - it's handled by archive service
    
class SLAAdminService(Updatable, Findable):
    # Only needs update and find
```

#### Specific Client Interfaces
```python
# For AI processing - only needs read and batch operations
class AIProcessor(Protocol):
    def get_pending_grievances(self) -> List[Grievance]: ...
    def update_ai_analysis(self, id: str, analysis: AIResult) -> None: ...

# For tracking - only needs read operations
class TrackingService(Protocol):
    def get_timeline(self, grid_id: str) -> List[TimelineEvent]: ...
    def get_current_status(self, grid_id: str) -> GrievanceStatus: ...

# For field verification - needs specific operations
class VerificationService(Protocol):
    def submit_evidence(self, grievance_id: str, photo: Photo, location: GeoLocation) -> Verification: ...
    def validate_location(self, photo_location: GeoLocation, incident_location: GeoLocation) -> bool: ...
```

---

## Dependency Inversion Principle ( DIP)

### Definition
High-level modules should not depend on low-level modules. Both should depend on abstractions.

### Implementation

#### Depend on Abstractions, Not Implementations
```python
# BAD - High-level depends on low-level
class GrievanceService:
    def __init__(self):
        self.db = PostgreSQLRepository()  # Direct dependency
    
# GOOD - Depend on abstraction
class GrievanceService:
    def __init__(self, repository: GrievanceRepository):
        self.repository = repository  # Depends on interface

# Infrastructure binds concrete implementation
def create_grievance_service() -> GrievanceService:
    repository = PostgreSQLGrievanceRepository(db_config)
    return GrievanceService(repository)
```

#### Injection Points
```python
# Constructor injection (preferred)
class GrievanceService:
    def __init__(
        self,
        repository: GrievanceRepository,
        llm_processor: LLMProcessor,
        vector_store: VectorStore,
        notification_service: NotificationService
    ):
        self.repository = repository
        self.llm = llm_processor
        self.vector = vector_store
        self.notifications = notification_service

# For testing - inject mocks
def test_grievance_creation():
    mock_repo = MockGrievanceRepository()
    mock_llm = MockLLMProcessor()
    mock_vector = MockVectorStore()
    mock_notify = MockNotificationService()
    
    service = GrievanceService(mock_repo, mock_llm, mock_vector, mock_notify)
    # Test logic without real dependencies
```

---

## Project-Specific Guidelines

### Layer Boundaries
```python
# Layer 1: Client (React) - No backend imports
# Layer 2: API Gateway - Can import Layer 3
# Layer 3: Core Application - No imports from Layer 4,5,6
# Layer 4: Data - Can use Layer 5 for vectors
# Layer 5: Vector Search - No external dependencies
# Layer 6: AI/ML - Independent
```

### File Naming Conventions
- `grievance_service.py` - Service class
- `grievance_repository.py` - Data access
- `grievance_dto.py` - Data transfer objects
- `grievance_schema.py` - Pydantic models
- `grievance_router.py` - API routes
- `grievance_test.py` - Unit tests

### Module Structure
```
grievance/
├── __init__.py
├── models.py          # Domain entities
├── schemas.py        # Pydantic validation
├── repository.py    # Data access (interface)
├── service.py       # Business logic
├── router.py        # API endpoints
└── test/
    ├── test_service.py
    └── test_integration.py
```

### Anti-Patterns to Avoid

1. **God Class**: A class that does too much
2. **Circular Dependencies**: A imports B, B imports A
3. **Feature Envy**: Class uses another class's data extensively
4. **Data Clumps**: Same group of parameters repeated
5. **Primitive Obsession**: Using primitives instead of objects

### Code Review Checklist

- [ ] Each class has single responsibility?
- [ ] New features extend without modifying existing code?
- [ ] Subclasses can replace parent classes?
- [ ] Interfaces are focused and specific?
- [ ] High-level code depends on abstractions?
- [ ] No layer boundary violations?
- [ ] Dependencies are injectable?
- [ ] Testable with mocks?

---

## Testing Guidelines

```python
# Tests should follow same SOLID principles
class TestGrievanceService:
    def setup(self):
        self.mock_repo = Mock(spec=GrievanceRepository)
        self.mock_llm = Mock(spec=LLMProcessor)
        self.service = GrievanceService(self.mock_repo, self.mock_llm)
    
    def test_create_triggers_ai_processing(self):
        # Arrange
        input = GrievanceInput(category="ROADS", description="...")
        
        # Act
        result = self.service.create(input)
        
        # Assert - verify interactions
        self.mock_llm.process.assert_called_once()
        self.mock_repo.save.assert_called_once()
```

---

## AI IDE Prompts

When generating or refactoring code, use these prompts:

```
"Create a new service following SRP - one responsibility only"
"Add new routing strategy using OCP - extend, don't modify"
"Create adapter interface for the AI model - depend on abstraction"
"Refactor this to use dependency injection - no direct instantiation"
"Split this interface into specific client interfaces - ISP compliance"
```