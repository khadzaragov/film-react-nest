DROP TABLE IF EXISTS "schedule";
DROP TABLE IF EXISTS "films";

CREATE TABLE "films" (
  "id" text PRIMARY KEY,
  "title" text NOT NULL,
  "about" text NOT NULL,
  "description" text NOT NULL,
  "director" text NOT NULL,
  "rating" double precision NOT NULL,
  "tags" text[] NOT NULL DEFAULT ARRAY[]::text[],
  "image" text NOT NULL,
  "cover" text NOT NULL
);

CREATE TABLE "schedule" (
  "id" text PRIMARY KEY,
  "daytime" text NOT NULL,
  "hall" integer NOT NULL,
  "rows" integer NOT NULL,
  "seats" integer NOT NULL,
  "price" integer NOT NULL,
  "taken" text[] NOT NULL DEFAULT ARRAY[]::text[],
  "filmId" text NOT NULL REFERENCES "films"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_schedule_filmId" ON "schedule"("filmId");
