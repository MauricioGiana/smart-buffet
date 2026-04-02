# Application

Services (CRUDs) and UseCases (Complex logic).

## Responsibility
- **Services**: Group simple CRUD operations (e.g., `ProductService`, `CategoryService`)
- **UseCases**: One class per complex action (e.g., `ProcessInvoiceUseCase`, `CalculatePredictiveStock`)
- Orchestrates domain entities and calls repositories via dependency injection

## Data Flow
`Controller → Service/UseCase → Repository → Prisma`
