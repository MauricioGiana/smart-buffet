# Smart-Buffet — Kanban Board

> Last updated: 2026-04-03 (rev 3) - Focus: Identity & Auth First

---

## ✅ DONE

### Task 1 — Project Initialization & Infrastructure

- [x] Backend folder initialized (pnpm v10 / Node v24 LTS).
- [x] Native Environment management (`--env-file`) configured.
- [x] Docker setup: PostgreSQL 16 + Healthchecks + Isolated Network.
- [x] Prisma Config & Multi-file schema support.
- [x] Core Database Models: `Tenant`, `User`, `Member` (Multi-tenancy & Soft Delete).
- [x] Hexagonal-Light folder structure established.

---

## 🚀 IN PROGRESS

### Task 2 — Auth & Identity (The "Secure Slice")

_Goal: Link Supabase JWT with business logic and enforce `tenant_id` context._

- [ ] **Infrastructure (Fastify):** Implement `AuthMiddleware`.
  - Validate Supabase JWT.
  - Inject `sub` (user_id) and `email` into the `request` object.
- [ ] **Domain/Application:** Create `RegisterBusinessUseCase`.
  - Orchestrate via `@transaction`: Create `Tenant` + Create `User` + Create `Member` (Role: OWNER).
  - Implement "White-List" (Allowed Emails) validation for the MVP.
- [ ] **Infrastructure (Routes):** Endpoint `POST /auth/onboarding`.
  - Receive business metadata and execute atomic provisioning.

---

## 🔜 BACKLOG (Prioritized Slices)

### Task 3 — Tenant Context & Global Filters

- [ ] Create `TenantContext` to persist `tenant_id` during the request lifecycle.
- [ ] Implement Prisma Extension for automatic filtering by `tenant_id` and `deleted_at` (Soft Delete).

### Task 4 — Catalog Module: First Steps

- [ ] **UseCase:** `GetCatalog` (List categories and products for the logged-in tenant).
- [ ] **UseCase:** `CreateCategory` / `CreateProduct`.
- [ ] **Domain:** Association table logic for ordering (`MenuToCategory`, etc).

### Task 5 — Security & RBAC

- [ ] Define permissions by roles (`OWNER`, `ADMIN`, `STAFF`).
- [ ] Role-based authorization middleware leveraging the `Member` table.

---

## 🧊 ICEBOX (Post-MVP)

- [ ] **Task 6 — OCR Module:** Claude 3.5 Sonnet integration for invoice/menu processing.
- [ ] **Task 7 — Analytics (SB-Predict):** Predictive engine for stock and sales forecasting.
- [ ] **Task 8 — WhatsApp Integrations:** Meta API adapter and order management.
