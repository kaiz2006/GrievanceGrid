-- Enable UUID and geospatial capabilities required by the platform.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Ensure gen_random_uuid defaults continue to work across environments.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- PostGIS expression index for fast proximity/spatial filtering over grievance coordinates.
CREATE INDEX IF NOT EXISTS "grievances_lat_lng_gist_idx"
ON "grievances"
USING GIST (
  ST_SetSRID(ST_MakePoint("longitude"::double precision, "latitude"::double precision), 4326)
)
WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL;
