-- better-auth core tables
-- These tables are managed by better-auth and should not be modified manually.

CREATE TABLE IF NOT EXISTS "user" (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  email            TEXT NOT NULL UNIQUE,
  "emailVerified"  BOOLEAN NOT NULL DEFAULT false,
  image            TEXT,
  "createdAt"      TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session (
  id           TEXT PRIMARY KEY,
  "expiresAt"  TIMESTAMP NOT NULL,
  token        TEXT NOT NULL UNIQUE,
  "createdAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
  "ipAddress"  TEXT,
  "userAgent"  TEXT,
  "userId"     TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS account (
  id                       TEXT PRIMARY KEY,
  "accountId"              TEXT NOT NULL,
  "providerId"             TEXT NOT NULL,
  "userId"                 TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "accessToken"            TEXT,
  "refreshToken"           TEXT,
  "idToken"                TEXT,
  "accessTokenExpiresAt"   TIMESTAMP,
  "refreshTokenExpiresAt"  TIMESTAMP,
  scope                    TEXT,
  password                 TEXT,
  "createdAt"              TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"              TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification (
  id           TEXT PRIMARY KEY,
  identifier   TEXT NOT NULL,
  value        TEXT NOT NULL,
  "expiresAt"  TIMESTAMP NOT NULL,
  "createdAt"  TIMESTAMP DEFAULT NOW(),
  "updatedAt"  TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS session_user_id_idx ON session("userId");
CREATE INDEX IF NOT EXISTS account_user_id_idx ON account("userId");
CREATE INDEX IF NOT EXISTS session_token_idx ON session(token);

-- Enable Row Level Security
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE session ENABLE ROW LEVEL SECURITY;
ALTER TABLE account ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification ENABLE ROW LEVEL SECURITY;

-- Only the service role (better-auth backend) can read/write these tables.
-- No public access.
CREATE POLICY "service role only" ON "user"
  USING (auth.role() = 'service_role');

CREATE POLICY "service role only" ON session
  USING (auth.role() = 'service_role');

CREATE POLICY "service role only" ON account
  USING (auth.role() = 'service_role');

CREATE POLICY "service role only" ON verification
  USING (auth.role() = 'service_role');
