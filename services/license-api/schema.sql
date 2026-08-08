-- Provider-neutral SQL model; compatible concepts can be mapped to D1/Postgres.
-- License keys must be stored as one-way hashes. Never store plaintext keys.

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','retired')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS licenses (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  key_hash TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('free','pro-yearly','lifetime','team','agency','white-label')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','revoked','suspended')),
  customer_ref TEXT,
  marketplace_source TEXT,
  external_order_reference TEXT,
  max_activations INTEGER NOT NULL DEFAULT 1 CHECK (max_activations >= 0),
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_licenses_product_status ON licenses(product_id, status);
CREATE INDEX IF NOT EXISTS idx_licenses_customer_ref ON licenses(customer_ref);

CREATE TABLE IF NOT EXISTS license_features (
  license_id TEXT NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  PRIMARY KEY (license_id, feature)
);

CREATE TABLE IF NOT EXISTS activations (
  id TEXT PRIMARY KEY,
  license_id TEXT NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
  installation_hash TEXT NOT NULL,
  activated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deactivated_at TEXT,
  UNIQUE (license_id, installation_hash)
);

CREATE INDEX IF NOT EXISTS idx_activations_license_active ON activations(license_id, deactivated_at);

CREATE TABLE IF NOT EXISTS marketplace_redemptions (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  external_code_hash TEXT NOT NULL,
  external_order_reference TEXT,
  license_id TEXT REFERENCES licenses(id),
  redeemed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, external_code_hash)
);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  license_id TEXT,
  product_id TEXT,
  request_id TEXT,
  occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);
