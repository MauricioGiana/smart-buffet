# Domain

Entities and Repository Contracts (Interfaces).

## Responsibility
- Define the core business entities (e.g., `Tenant`, `Category`, `Product`)
- Define repository contracts as TypeScript interfaces (NO `I` prefix — e.g., `ProductRepository`, NOT `IProductRepository`)
- Zero external dependencies — pure TypeScript only

## Naming Conventions
- Interfaces: `ProductRepository` ✅ | `IProductRepository` ❌
- Entities: PascalCase classes/types
- Fields: camelCase
