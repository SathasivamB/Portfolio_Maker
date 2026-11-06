-- ============================================================================
-- FOLIO AI v2: High-Performance Production Relational Database Schema
-- Compatible with SQLite (Native Node.js node:sqlite) and PostgreSQL
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  avatar TEXT,
  bio TEXT,
  provider TEXT DEFAULT 'github',
  custom_domain TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. PORTFOLIOS TABLE
CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  username TEXT UNIQUE NOT NULL,
  title TEXT,
  bio TEXT,
  avatar TEXT,
  active_theme TEXT DEFAULT 'creator-dark',
  font_style TEXT DEFAULT 'sans',
  custom_role TEXT,
  custom_top_color TEXT,
  custom_bottom_color TEXT,
  custom_font_style TEXT,
  palette_json TEXT,              -- JSON encoded color palette
  selected_sections_json TEXT,    -- JSON array of active section IDs
  sub_components_json TEXT,       -- JSON object of granular widget flags
  custom_sections_json TEXT,      -- JSON array of section reordering
  pricing_packages_json TEXT,     -- JSON array of retainer & sprint packages
  tools_arsenal_json TEXT,        -- JSON array of tech tools
  metrics_json TEXT,              -- JSON array of stats
  certifications_json TEXT,       -- JSON array of verified credentials
  custom_template TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_portfolios_username ON portfolios(username);

-- 3. PORTFOLIO ITEMS (Projects, Repositories, Case Studies)
CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY,
  portfolio_id TEXT,
  username TEXT NOT NULL,
  title TEXT NOT NULL,
  external_id TEXT,
  language TEXT,
  description TEXT,
  url TEXT,
  thumbnail TEXT,
  metrics_json TEXT,              -- JSON metrics (e.g. stars, forks, qps)
  tags_json TEXT,                 -- JSON array of tags
  goals TEXT,
  tools TEXT,
  outcomes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_items_username ON portfolio_items(username);
CREATE INDEX IF NOT EXISTS idx_items_portfolio ON portfolio_items(portfolio_id);

-- 4. CLIENT PITCHES & CONFIDENTIAL PROPOSALS
CREATE TABLE IF NOT EXISTS client_pitches (
  id TEXT PRIMARY KEY,
  secret_slug TEXT UNIQUE NOT NULL,
  creator_username TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_industry TEXT,
  custom_headline TEXT,
  selected_item_ids_json TEXT,    -- JSON array of chosen item IDs
  proposal_state_json TEXT,       -- JSON object of packages & deliverables
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pitches_slug ON client_pitches(secret_slug);
CREATE INDEX IF NOT EXISTS idx_pitches_creator ON client_pitches(creator_username);

-- 5. CLIENT INQUIRIES & LEAD CAPTURE
CREATE TABLE IF NOT EXISTS client_inquiries (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  package_name TEXT,
  project_details TEXT,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_inquiries_username ON client_inquiries(username);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON client_inquiries(status);

-- 6. ANTIGRAVITY ENGINE SNAPSHOTS (Undo/Redo 10-State Ring Buffer)
CREATE TABLE IF NOT EXISTS antigravity_snapshots (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  trigger_label TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,    -- Complete portfolio state snapshot
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_snapshots_username ON antigravity_snapshots(username);
