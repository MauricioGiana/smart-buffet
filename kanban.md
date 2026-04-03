# Smart-Buffet — Kanban Board

> Last updated: 2026-04-02 (rev 2)

---

## ✅ DONE

### Task 1 — Project Initialization & Infrastructure Boilerplate

**Status:** Code complete. Migration pending Docker access (see note below).

**Completed:**

- [x] `/backend` folder initialized with `pnpm init` (pnpm v10 / Node v24 LTS)
- [x] `package.json` — name: `smart-buffet-api`, all scripts configured:
  - `dev`: `node --env-file=.env --import tsx --watch src/server.ts` ✅ (native Node.js env, NO dotenv)
  - `build`, `start`, `prisma:migrate`, `prisma:generate`
- [x] `tsconfig.json` — strict mode, `target: ESNext`, `module: NodeNext`, `outDir: dist`
- [x] `src/server.ts` — Fastify app with `logger: true`, `/health` endpoint, `0.0.0.0` host
- [x] `backend/docker-compose.yml` — PostgreSQL 16, user: `user_sb`, db: `smart_buffet_db`, port 5432, healthcheck
- [x] `docker-compose.yml` (root) — delegates to `./backend` context so `docker compose up --build` works from project root
- [x] `.env` — `DATABASE_URL`, `PORT=3000`, `NODE_ENV=development` (native Node.js `--env-file`)
- [x] `.env.example` — template with empty values
- [x] `.gitignore` — `.env`, `node_modules/`, `dist/`, `src/generated/`
- [x] `prisma.config.ts` — Prisma 7 config, no dotenv, reads `process.env['DATABASE_URL']`
- [x] `prisma/schema.prisma` — validated ✅ with 3 models:
  - `Tenant` → table `tenants` (renamed from older `Business` concept)
  - `Category` → table `categories` (tenantId → `tenant_id`, @@index)
  - `Product` → table `products` (tenantId → `tenant_id`, categoryId → `category_id`, `@db.Decimal(10,2)`, @@index)
- [x] Hexagonal-Light folder structure:
  - `src/modules/core/domain/`
  - `src/modules/core/application/`
  - `src/modules/core/infrastructure/`
- [x] All column names snake_case via `@map` / `@@map`
- [x] All TS code camelCase
- [x] No `I` prefix on interfaces (convention established)

**⚠️ Pending — Run after getting Docker access:**

```bash
# Add mgiana to docker group (run as maudev or with sudo):
sudo usermod -aG docker mgiana
# Then re-login or start a new shell session, then:

# From project root (docker-compose.yml now lives here):
docker compose up --build -d
# Wait ~5s for Postgres to be healthy, then:
cd backend
pnpm prisma migrate dev --name init_core_models
pnpm prisma generate
```

---

## 🔜 BACKLOG

### Task 2 — Core Domain Models (TypeScript)

- Define `Tenant`, `Category`, `Product` entities in `src/modules/core/domain/`
- Define repository contracts: `TenantRepository`, `CategoryRepository`, `ProductRepository`

### Task 3 — Core Infrastructure (Prisma Repositories)

- Implement `PrismaTenantRepository`, `PrismaCategoryRepository`, `PrismaProductRepository`
- Wire up Prisma Client singleton

### Task 4 — Core Application (CRUD Services)

- Implement `TenantService`, `CategoryService`, `ProductService`
- Fastify routes under `src/modules/core/infrastructure/`

### Task 5 — OCR Module

- `ProcessInvoiceUseCase` with Claude 3.5 Sonnet integration
- Menu OCR pipeline

### Task 6 — Analytics Module (SB-Predict)

- `CalculatePredictiveStock` UseCase
- Sales forecasting engine

### Task 7 — Integrations Module

- WhatsApp Meta API adapter
- Order management via `WhatsAppMetaAdapter`
