import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../../server/database.js';

describe('DatabaseEngine Unit Tests', () => {
  it('should seed default users (alexchen and sathasivamb)', () => {
    const alex = db.getUser('alexchen');
    assert.ok(alex, 'alexchen user must exist');
    assert.equal(alex.username, 'alexchen');
    assert.equal(alex.name, 'Alex Chen');

    const satha = db.getUser('sathasivamb');
    assert.ok(satha, 'sathasivamb user must exist');
    assert.equal(satha.username, 'sathasivamb');
    assert.ok(satha.name.startsWith('Sathasivam'), 'sathasivamb name must start with Sathasivam');
    assert.equal(satha.provider, 'github');
  });

  it('should return null or undefined for non-existent user', () => {
    const randomKey = 'unknown_user_' + Math.random().toString(36).substring(2, 10);
    const fake = db.getUser(randomKey);
    assert.equal(fake, null);
  });

  it('should save and update a test user', () => {
    const testUsername = 'test_dev_' + Date.now();
    const newUser = {
      id: `usr_${testUsername}`,
      username: testUsername,
      name: 'Test Engineer',
      role: 'Principal Systems Architect',
      email: `${testUsername}@test.folio`
    };

    db.saveUser(testUsername, newUser);
    const retrieved = db.getUser(testUsername);
    assert.ok(retrieved);
    assert.equal(retrieved.username, testUsername);
    assert.equal(retrieved.name, 'Test Engineer');
    assert.equal(retrieved.role, 'Principal Systems Architect');
  });

  it('should retrieve portfolio with valid structure and items', () => {
    const port = db.getPortfolio('sathasivamb');
    assert.ok(port, 'Portfolio for sathasivamb must exist');
    assert.equal(port.username, 'sathasivamb');
    assert.ok(Array.isArray(port.items), 'Portfolio must contain items array');
    assert.ok(port.items.length > 0, 'Portfolio items must not be empty');
    
    // Check first item structure
    const item = port.items[0];
    assert.ok(item.title);
    assert.ok(item.description);
    assert.ok(item.metrics);
  });

  it('should configure custom portfolio with sections and subcomponents', () => {
    const username = 'sathasivamb';
    const config = {
      template: 'prism',
      role: 'AI Systems Engineer',
      headline: 'Next-Gen Neural Architectures',
      bio: 'Pioneering speculative decoding and low-latency inference pipelines.',
      topColor: '#2340FF',
      bottomColor: '#FFD84D',
      fontStyle: 'mono',
      sections: [
        { id: 'hero', enabled: true },
        { id: 'skills', enabled: true },
        { id: 'projects', enabled: true },
        { id: 'stats', enabled: false }
      ],
      subComponents: {
        navbar_brand_logo: true,
        navbar_nav_links: true,
        navbar_status_badge: true,
        hero_terminal_window: true,
        hero_clone_snippet: false
      }
    };

    const result = db.configureCustomPortfolio(username, config);
    assert.ok(result);
    assert.ok(result.portfolio);
    assert.equal(result.portfolio.custom_template, 'prism');
    assert.equal(result.portfolio.custom_role, 'AI Systems Engineer');
    assert.equal(result.portfolio.custom_top_color, '#2340FF');
    assert.equal(result.portfolio.custom_bottom_color, '#FFD84D');
    assert.equal(result.portfolio.custom_font_style, 'mono');
    assert.deepEqual(result.portfolio.custom_sections, config.sections);
    assert.equal(result.portfolio.sub_components.hero_terminal_window, true);
    assert.equal(result.portfolio.sub_components.hero_clone_snippet, false);
  });

  it('should support Antigravity history snapshot, undo, and redo', () => {
    const username = 'alexchen';
    const initialPort = db.getPortfolio(username);
    assert.ok(initialPort);

    // Save initial state snapshot
    db.saveSnapshot(username, initialPort, 'Initial Baseline');

    // Make an update
    const modifiedPort = { ...initialPort, title: 'Updated Title ' + Date.now() };
    db.savePortfolio(username, modifiedPort, 'Title Change');

    const currentPort = db.getPortfolio(username);
    assert.equal(currentPort.title, modifiedPort.title);

    // Perform Undo
    const undone = db.antigravityUndo(username);
    assert.ok(undone.success, 'Undo should succeed');
    assert.equal(undone.portfolio.title, initialPort.title);

    // Perform Redo
    const redone = db.antigravityRedo(username);
    assert.ok(redone.success, 'Redo should succeed');
    assert.equal(redone.portfolio.title, modifiedPort.title);
  });

  it('should create and retrieve client pitches with secret slugs', () => {
    const username = 'alexchen';
    const pitchData = {
      clientName: 'Acme Cloud Corp',
      clientIndustry: 'Distributed Cloud Infra',
      customHeadline: 'High-Throughput Kubernetes & Rust Migration',
      selectedItemIds: []
    };

    const createdPitch = db.createClientPitch(username, pitchData);
    assert.ok(createdPitch);
    assert.ok(createdPitch.secret_slug, 'Pitch must have a secret slug');
    assert.equal(createdPitch.client_name, 'Acme Cloud Corp');
    assert.equal(createdPitch.creator_username, username);

    const retrievedPitch = db.getClientPitch(createdPitch.secret_slug);
    assert.ok(retrievedPitch);
    assert.equal(retrievedPitch.client_name, 'Acme Cloud Corp');
    assert.equal(retrievedPitch.custom_headline, 'High-Throughput Kubernetes & Rust Migration');
  });
});
