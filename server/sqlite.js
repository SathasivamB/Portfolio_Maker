/**
 * Native SQLite Relational Database Adapter
 * Powered by Node.js native node:sqlite DatabaseSync
 * Provides ACID transactions, prepared statements, and relational integrity.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'portfolio.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let sqliteEngine = null;

try {
  // Use Node.js native SQLite
  const { DatabaseSync } = await import('node:sqlite');
  sqliteEngine = new DatabaseSync(DB_PATH);
  
  // Enable foreign keys and WAL mode for maximum performance and concurrency
  sqliteEngine.exec('PRAGMA foreign_keys = ON;');
  sqliteEngine.exec('PRAGMA journal_mode = WAL;');
  
  // Run schema migration if file exists
  if (fs.existsSync(SCHEMA_PATH)) {
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    sqliteEngine.exec(schemaSql);
  }

  // Ensure SaaS subscription columns exist (auto-migration)
  const columnsToAdd = [
    { name: 'plan', type: "TEXT DEFAULT 'trial_pro'" },
    { name: 'trial_started_at', type: "TEXT" },
    { name: 'trial_expires_at', type: "TEXT" },
    { name: 'subscription_json', type: "TEXT" }
  ];
  for (const col of columnsToAdd) {
    try {
      sqliteEngine.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type};`);
    } catch {
      // Column already exists, safe to ignore
    }
  }

  console.log(`✓ Relational SQLite database initialized at ${DB_PATH}`);
} catch (err) {
  console.warn(`[SQLite Warning] Falling back to structured memory store: ${err.message}`);
}

export class SqliteAdapter {
  constructor() {
    this.db = sqliteEngine;
  }

  isAvailable() {
    return Boolean(this.db);
  }

  // --- Users ---
  getUser(username) {
    if (!this.db) return null;
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1');
      return stmt.get(username) || null;
    } catch {
      return null;
    }
  }

  saveUser(user) {
    if (!this.db || !user?.username) return;
    try {
      const stmt = this.db.prepare(`
        INSERT INTO users (id, username, email, name, role, avatar, bio, provider, custom_domain, plan, trial_started_at, trial_expires_at, subscription_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(username) DO UPDATE SET
          email = excluded.email,
          name = excluded.name,
          role = excluded.role,
          avatar = excluded.avatar,
          bio = excluded.bio,
          provider = excluded.provider,
          custom_domain = excluded.custom_domain,
          plan = excluded.plan,
          trial_started_at = excluded.trial_started_at,
          trial_expires_at = excluded.trial_expires_at,
          subscription_json = excluded.subscription_json,
          updated_at = CURRENT_TIMESTAMP
      `);
      stmt.run(
        user.id || `usr_${user.username}`,
        user.username.toLowerCase(),
        user.email || `${user.username}@domain.com`,
        user.name || user.username,
        user.role || 'Developer',
        user.avatar || '',
        user.bio || '',
        user.provider || 'github',
        user.custom_domain || `${user.username}.folio.ai`,
        user.plan || 'trial_pro',
        user.trial_started_at || new Date().toISOString(),
        user.trial_expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        user.subscription ? JSON.stringify(user.subscription) : null
      );
    } catch (err) {
      console.warn("SQLite saveUser warning:", err.message);
    }
  }

  updateSubscription(username, sub) {
    if (!this.db || !username) return null;
    try {
      const stmt = this.db.prepare(`
        UPDATE users SET
          plan = ?,
          trial_started_at = ?,
          trial_expires_at = ?,
          subscription_json = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE LOWER(username) = LOWER(?)
      `);
      stmt.run(
        sub.plan || 'trial_pro',
        sub.trial_started_at || new Date().toISOString(),
        sub.trial_expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        JSON.stringify(sub),
        username.toLowerCase()
      );
      return this.getUser(username);
    } catch (err) {
      console.warn("SQLite updateSubscription warning:", err.message);
      return null;
    }
  }

  // --- Portfolios ---
  getPortfolio(username) {
    if (!this.db) return null;
    try {
      const stmt = this.db.prepare('SELECT * FROM portfolios WHERE LOWER(username) = LOWER(?) LIMIT 1');
      const row = stmt.get(username);
      if (!row) return null;

      // Parse JSON columns
      return {
        ...row,
        palette: row.palette_json ? JSON.parse(row.palette_json) : null,
        selected_sections: row.selected_sections_json ? JSON.parse(row.selected_sections_json) : null,
        sub_components: row.sub_components_json ? JSON.parse(row.sub_components_json) : null,
        custom_sections: row.custom_sections_json ? JSON.parse(row.custom_sections_json) : null,
        pricing_packages: row.pricing_packages_json ? JSON.parse(row.pricing_packages_json) : null,
        tools_arsenal: row.tools_arsenal_json ? JSON.parse(row.tools_arsenal_json) : null,
        metrics: row.metrics_json ? JSON.parse(row.metrics_json) : null,
        certifications: row.certifications_json ? JSON.parse(row.certifications_json) : []
      };
    } catch {
      return null;
    }
  }

  savePortfolio(port) {
    if (!this.db || !port?.username) return;
    try {
      const stmt = this.db.prepare(`
        INSERT INTO portfolios (
          id, username, title, bio, avatar, active_theme, font_style,
          custom_role, custom_top_color, custom_bottom_color, custom_font_style, custom_template,
          palette_json, selected_sections_json, sub_components_json, custom_sections_json,
          pricing_packages_json, tools_arsenal_json, metrics_json, certifications_json, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, CURRENT_TIMESTAMP
        )
        ON CONFLICT(username) DO UPDATE SET
          title = excluded.title,
          bio = excluded.bio,
          avatar = excluded.avatar,
          active_theme = excluded.active_theme,
          font_style = excluded.font_style,
          custom_role = excluded.custom_role,
          custom_top_color = excluded.custom_top_color,
          custom_bottom_color = excluded.custom_bottom_color,
          custom_font_style = excluded.custom_font_style,
          custom_template = excluded.custom_template,
          palette_json = excluded.palette_json,
          selected_sections_json = excluded.selected_sections_json,
          sub_components_json = excluded.sub_components_json,
          custom_sections_json = excluded.custom_sections_json,
          pricing_packages_json = excluded.pricing_packages_json,
          tools_arsenal_json = excluded.tools_arsenal_json,
          metrics_json = excluded.metrics_json,
          certifications_json = excluded.certifications_json,
          updated_at = CURRENT_TIMESTAMP
      `);

      stmt.run(
        port.id || `port_${port.username}`,
        port.username.toLowerCase(),
        port.title || '',
        port.bio || '',
        port.avatar || '',
        port.active_theme || 'creator-dark',
        port.font_style || 'sans',
        port.custom_role || '',
        port.custom_top_color || '',
        port.custom_bottom_color || '',
        port.custom_font_style || '',
        port.custom_template || '',
        port.palette ? JSON.stringify(port.palette) : null,
        port.selected_sections ? JSON.stringify(port.selected_sections) : null,
        port.sub_components ? JSON.stringify(port.sub_components) : null,
        port.custom_sections ? JSON.stringify(port.custom_sections) : null,
        port.pricing_packages ? JSON.stringify(port.pricing_packages) : null,
        port.tools_arsenal ? JSON.stringify(port.tools_arsenal) : null,
        port.metrics ? JSON.stringify(port.metrics) : null,
        port.certifications ? JSON.stringify(port.certifications) : '[]'
      );
    } catch (err) {
      console.warn("SQLite savePortfolio warning:", err.message);
    }
  }

  // --- Portfolio Items ---
  getItems(username) {
    if (!this.db) return [];
    try {
      const stmt = this.db.prepare('SELECT * FROM portfolio_items WHERE LOWER(username) = LOWER(?) ORDER BY sort_order ASC');
      const rows = stmt.all(username);
      return rows.map(r => ({
        ...r,
        metrics: r.metrics_json ? JSON.parse(r.metrics_json) : null,
        tags: r.tags_json ? JSON.parse(r.tags_json) : []
      }));
    } catch {
      return [];
    }
  }

  saveItem(item) {
    if (!this.db || !item?.id) return;
    try {
      const stmt = this.db.prepare(`
        INSERT INTO portfolio_items (
          id, portfolio_id, username, title, external_id, language, description,
          url, thumbnail, metrics_json, tags_json, goals, tools, outcomes, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          description = excluded.description,
          url = excluded.url,
          thumbnail = excluded.thumbnail,
          metrics_json = excluded.metrics_json,
          tags_json = excluded.tags_json,
          goals = excluded.goals,
          tools = excluded.tools,
          outcomes = excluded.outcomes,
          sort_order = excluded.sort_order
      `);

      stmt.run(
        item.id,
        item.portfolio_id || `port_${item.username}`,
        (item.username || 'sathasivamb').toLowerCase(),
        item.title || item.name || 'Project',
        item.external_id || '',
        item.lang || item.language || 'TypeScript',
        item.desc || item.description || '',
        item.url || '',
        item.thumb || item.thumbnail || '',
        item.metrics ? JSON.stringify(item.metrics) : null,
        item.tags ? JSON.stringify(item.tags) : null,
        item.goals || '',
        item.tools || '',
        item.outcomes || '',
        item.sort_order || 0
      );
    } catch (err) {
      console.warn("SQLite saveItem warning:", err.message);
    }
  }

  // --- Client Pitches ---
  getPitch(secretSlug) {
    if (!this.db) return null;
    try {
      const stmt = this.db.prepare('SELECT * FROM client_pitches WHERE secret_slug = ? LIMIT 1');
      const row = stmt.get(secretSlug);
      if (!row) return null;
      return {
        ...row,
        selected_item_ids: row.selected_item_ids_json ? JSON.parse(row.selected_item_ids_json) : [],
        proposal_state: row.proposal_state_json ? JSON.parse(row.proposal_state_json) : {}
      };
    } catch {
      return null;
    }
  }

  savePitch(pitch) {
    if (!this.db || !pitch?.secret_slug) return;
    try {
      const stmt = this.db.prepare(`
        INSERT INTO client_pitches (
          id, secret_slug, creator_username, client_name, client_industry,
          custom_headline, selected_item_ids_json, proposal_state_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(secret_slug) DO UPDATE SET
          client_name = excluded.client_name,
          client_industry = excluded.client_industry,
          custom_headline = excluded.custom_headline,
          selected_item_ids_json = excluded.selected_item_ids_json,
          proposal_state_json = excluded.proposal_state_json
      `);

      stmt.run(
        pitch.id || `ptc_${pitch.secret_slug}`,
        pitch.secret_slug,
        (pitch.creator_username || 'sathasivamb').toLowerCase(),
        pitch.client_name || '',
        pitch.client_industry || '',
        pitch.custom_headline || '',
        pitch.selected_item_ids ? JSON.stringify(pitch.selected_item_ids) : '[]',
        pitch.proposal_state ? JSON.stringify(pitch.proposal_state) : '{}'
      );
    } catch (err) {
      console.warn("SQLite savePitch warning:", err.message);
    }
  }

  // --- Inquiries ---
  recordInquiry(inquiry) {
    if (!this.db) return;
    try {
      const stmt = this.db.prepare(`
        INSERT INTO client_inquiries (id, username, client_name, email, package_name, project_details, status)
        VALUES (?, ?, ?, ?, ?, ?, 'unread')
      `);
      stmt.run(
        inquiry.id || `inq_${Date.now()}`,
        (inquiry.username || 'sathasivamb').toLowerCase(),
        inquiry.clientName || inquiry.name || '',
        inquiry.email || '',
        inquiry.packageName || '',
        inquiry.projectDetails || inquiry.message || ''
      );
    } catch (err) {
      console.warn("SQLite recordInquiry warning:", err.message);
    }
  }
}

export const sqliteAdapter = new SqliteAdapter();
