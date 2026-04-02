-- Smart-Buffet: init_core_architecture
-- Single clean migration. All tables use:
--   • UUID PKs with gen_random_uuid() — named pk_<table>
--   • tenant_id UUID NOT NULL with index
--   • snake_case column names
--   • VARCHAR with explicit lengths (no unbounded TEXT)
--   • No DB enums — status fields are VARCHAR(30), validated in Domain layer
--   • ON DELETE RESTRICT on all foreign keys

-- ─── Users ────────────────────────────────────────────────────────────────────

CREATE TABLE "users" (
    "id"            UUID         NOT NULL DEFAULT gen_random_uuid(),
    "email"         VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_users" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- ─── Tenants ─────────────────────────────────────────────────────────────────

CREATE TABLE "tenants" (
    "id"         UUID         NOT NULL DEFAULT gen_random_uuid(),
    "name"       VARCHAR(255) NOT NULL,
    "slug"       VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_tenants" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- ─── Tenant Members ────────────────────────────────────────────────────────────

CREATE TABLE "tenant_members" (
    "id"        UUID         NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID         NOT NULL,
    "user_id"   UUID         NOT NULL,
    "role"      VARCHAR(30)  NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_tenant_members" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uq_tenant_members_user_tenant" ON "tenant_members"("user_id", "tenant_id");
CREATE        INDEX "idx_tenant_members_tenant_id"  ON "tenant_members"("tenant_id");
CREATE        INDEX "idx_tenant_members_user_id"    ON "tenant_members"("user_id");

-- ─── Menus ────────────────────────────────────────────────────────────────────

CREATE TABLE "menus" (
    "id"        UUID         NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID         NOT NULL,
    "name"      VARCHAR(255) NOT NULL,
    "status"    VARCHAR(30)  NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_menus" PRIMARY KEY ("id")
);

CREATE INDEX "idx_menus_tenant_id" ON "menus"("tenant_id");

-- ─── Categories ───────────────────────────────────────────────────────────────

CREATE TABLE "categories" (
    "id"         UUID         NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"  UUID         NOT NULL,
    "menu_id"    UUID         NOT NULL,
    "name"       VARCHAR(255) NOT NULL,
    "position"   INTEGER      NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_categories" PRIMARY KEY ("id")
);

CREATE INDEX "idx_categories_tenant_id" ON "categories"("tenant_id");
CREATE INDEX "idx_categories_menu_id"   ON "categories"("menu_id");

-- ─── Products ─────────────────────────────────────────────────────────────────

CREATE TABLE "products" (
    "id"             UUID          NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"      UUID          NOT NULL,
    "category_id"    UUID          NOT NULL,
    "name"           VARCHAR(255)  NOT NULL,
    "description"    VARCHAR(1000),
    "image_url"      VARCHAR(2048),
    "price_in_cents" INTEGER       NOT NULL,
    "status"         VARCHAR(30)   NOT NULL DEFAULT 'available',
    "created_at"     TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3)  NOT NULL,

    CONSTRAINT "pk_products" PRIMARY KEY ("id")
);

CREATE INDEX "idx_products_tenant_id"   ON "products"("tenant_id");
CREATE INDEX "idx_products_category_id" ON "products"("category_id");

-- ─── Foreign Keys (all ON DELETE RESTRICT) ───────────────────────────────────

ALTER TABLE "tenant_members"
    ADD CONSTRAINT "tenant_members_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tenant_members"
    ADD CONSTRAINT "tenant_members_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "menus"
    ADD CONSTRAINT "menus_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "categories"
    ADD CONSTRAINT "categories_menu_id_fkey"
    FOREIGN KEY ("menu_id") REFERENCES "menus"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "products"
    ADD CONSTRAINT "products_category_id_fkey"
    FOREIGN KEY ("category_id") REFERENCES "categories"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
