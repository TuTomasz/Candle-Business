
-- Up Migration

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "fragrance" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" varchar(255) NOT NULL,
    "description" varchar(255) NOT NULL,
    "category" varchar(255) NOT NULL,
    "created_At" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_url"   varchar(255) NOT NULL
);

-- Down Migration

DROP TABLE IF EXISTS "fragrance";





