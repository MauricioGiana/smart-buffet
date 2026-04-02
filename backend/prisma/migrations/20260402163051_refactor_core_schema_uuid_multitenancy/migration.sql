-- Refactor: drop old tables/enums wholesale, recreate with UUID PKs,
-- named PK constraints (pk_<table>), tenant_id columns, VARCHAR limits,
-- ON DELETE RESTRICT foreign keys, and multi-tenancy indexes.
-- This migration is safe on an empty dev database.

-- 1. Drop all FKs so tables can be dropped in any order
ALTER TABLE "order_items"     DROP CONSTRAINT IF EXISTS "order_items_menu_item_id_fkey";
ALTER TABLE "order_items"     DROP CONSTRAINT IF EXISTS "order_items_order_id_fkey";
ALTER TABLE "orders"          DROP CONSTRAINT IF EXISTS "orders_business_id_fkey";
ALTER TABLE "orders"          DROP CONSTRAINT IF EXISTS "orders_table_id_fkey";
ALTER TABLE "tables"          DROP CONSTRAINT IF EXISTS "tables_business_id_fkey";
ALTER TABLE "menu_items"      DROP CONSTRAINT IF EXISTS "menu_items_category_id_fkey";
ALTER TABLE "menu_categories" DROP CONSTRAINT IF EXISTS "menu_categories_menu_id_fkey";
ALTER TABLE "menus"           DROP CONSTRAINT IF EXISTS "menus_business_id_fkey";

-- 2. Drop tables out of scope
DROP TABLE IF EXISTS "order_items";
DROP TABLE IF EXISTS "orders";
DROP TABLE IF EXISTS "tables";

-- 3. Drop stale enums
DROP TYPE IF EXISTS "order_status";
DROP TYPE IF EXISTS "table_status";

-- 4. Recreate core tables (TEXT->UUID has no implicit cast; drop+recreate is correct)
DROP TABLE IF EXISTS "menu_items";
DROP TABLE IF EXISTS "menu_categories";
DROP TABLE IF EXISTS "menus";
DROP TABLE IF EXISTS "businesses";

CREATE TABLE "businesses" (
    "id"         UUID         NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"  UUID         NOT NULL,
    "name"       VARCHAR(255) NOT NULL,
    "slug"       VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "pk_businesses" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "businesses_slug_key"       ON "businesses"("slug");
CREATE INDEX        "idx_businesses_tenant_id"  ON "businesses"("tenant_id");

CREATE TABLE "menus" (
    "id"          UUID         NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"   UUID         NOT NULL,
    "business_id" UUID         NOT NULL,
    "name"        VARCHAR(255) NOT NULL,
    "is_active"   BOOLEAN      NOT NULL DEFAULT true,
    "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"  TIMESTAMP(3) NOT NULL,
    CONSTRAINT "pk_menus" PRIMARY KEY ("id")
);
CREATE INDEX "idx_menus_tenant_id"   ON "menus"("tenant_id");
CREATE INDEX "idx_menus_business_id" ON "menus"("business_id");

CREATE TABLE "menu_categories" (
    "id"         UUID         NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"  UUID         NOT NULL,
    "menu_id"    UUID         NOT NULL,
    "name"       VARCHAR(255) NOT NULL,
    "position"   INTEGER      NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "pk_menu_categories" PRIMARY KEY ("id")
);
CREATE INDEX "idx_menu_categories_tenant_id" ON "menu_categories"("tenant_id");
CREATE INDEX "idx_menu_categories_menu_id"   ON "menu_categories"("menu_id");

CREATE TABLE "menu_items" (
    "id"             UUID          NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"      UUID          NOT NULL,
    "category_id"    UUID          NOT NULL,
    "name"           VARCHAR(255)  NOT NULL,
    "description"    VARCHAR(1000),
    "image_url"      VARCHAR(2048),
    "price_in_cents" INTEGER       NOT NULL,
    "is_available"   BOOLEAN       NOT NULL DEFAULT true,
    "created_at"     TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3)  NOT NULL,
    CONSTRAINT "pk_menu_items" PRIMARY KEY ("id")
);
CREATE INDEX "idx_menu_items_tenant_id"   ON "menu_items"("tenant_id");
CREATE INDEX "idx_menu_items_category_id" ON "menu_items"("category_id");

-- 5. Add foreign keys (ON DELETE RESTRICT)
ALTER TABLE "menus"
    ADD CONSTRAINT "menus_business_id_fkey"
    FOREIGN KEY ("business_id") REFERENCES "businesses"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "menu_categories"
    ADD CONSTRAINT "menu_categories_menu_id_fkey"
    FOREIGN KEY ("menu_id") REFERENCES "menus"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "menu_items"
    ADD CONSTRAINT "menu_items_category_id_fkey"
    FOREIGN KEY ("category_id") REFERENCES "menu_categories"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
