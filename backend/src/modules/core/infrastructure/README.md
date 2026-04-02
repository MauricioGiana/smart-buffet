# Infrastructure

Prisma implementations, Fastify routes, and External APIs.

## Responsibility
- **Repositories**: Prisma implementations of domain contracts (e.g., `PrismaProductRepository`)
- **Routes**: Fastify route handlers and controllers
- **External APIs**: Third-party integrations (e.g., `ClaudeOcrProvider`, `WhatsAppMetaAdapter`)

## Naming Conventions
- Repository implementations: `Prisma<Entity>Repository` (e.g., `PrismaProductRepository`)
- External API adapters: `<Provider><Capability>Provider` (e.g., `ClaudeOcrProvider`)
