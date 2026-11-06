import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../../server/database.js';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5001';

describe('End-to-End Complete User Journey Tests', () => {

  it('Workflow 1: Setup Wizard Complete Journey (Archetype -> AI -> Sections -> Style -> Launch)', async () => {
    const testUsername = 'e2e_engineer_' + Date.now();
    
    // 1. Initial user creation
    db.saveUser(testUsername, {
      id: `usr_${testUsername}`,
      username: testUsername,
      name: 'E2E Testing Architect',
      email: `${testUsername}@test.io`,
      provider: 'github'
    });

    // 2. Step 1: Select Archetype & Generate AI Blueprint
    const aiRes = await fetch(`${BASE_URL}/api/ai/generate-template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: 'prism',
        username: testUsername,
        displayName: 'E2E Testing Architect'
      })
    });
    assert.equal(aiRes.status, 200);
    const aiData = await aiRes.json();
    assert.equal(aiData.success, true);
    assert.ok(aiData.blueprint.role);

    // 3. Step 2 & 3: Customize Sections & Sub-Components
    const reorderedSections = [
      { id: 'hero', title: 'Developer Hero', enabled: true },
      { id: 'projects', title: 'Featured Code Repositories', enabled: true },
      { id: 'skills', title: 'Tech Stack Grid', enabled: true },
      { id: 'pricing', title: 'Engineering Retainers', enabled: true },
      { id: 'stats', title: 'Delivery Counters', enabled: false }
    ];

    const customizedSubComponents = {
      navbar_brand_logo: true,
      navbar_nav_links: true,
      navbar_status_badge: true,
      hero_terminal_window: true,
      hero_clone_snippet: true,
      hero_verified_badge: true,
      platform_github: true,
      platform_linkedin: true,
      platform_youtube: false
    };

    // 4. Step 4: Finalize Dual-Tone Palette & Launch
    const setupRes = await fetch(`${BASE_URL}/api/portfolio/custom-setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        config: {
          name: 'E2E Testing Architect',
          role: aiData.blueprint.role,
          headline: aiData.blueprint.headline,
          bio: aiData.blueprint.bio,
          template: 'prism',
          topColor: '#2340FF',
          bottomColor: '#FFD84D',
          fontStyle: 'mono',
          sections: reorderedSections,
          subComponents: customizedSubComponents,
          pricing_packages: aiData.blueprint.pricing_packages,
          tools_arsenal: aiData.blueprint.tools_arsenal,
          metrics: aiData.blueprint.metrics
        }
      })
    });

    assert.equal(setupRes.status, 200);
    const setupData = await setupRes.json();
    assert.equal(setupData.success, true);

    // 5. Verification: Fetch customized portfolio and inspect state
    const fetchRes = await fetch(`${BASE_URL}/api/portfolio/${testUsername}`);
    assert.equal(fetchRes.status, 200);
    const fetched = await fetchRes.json();
    assert.equal(fetched.success, true);
    assert.equal(fetched.portfolio.custom_template, 'prism');
    assert.equal(fetched.portfolio.custom_top_color, '#2340FF');
    assert.equal(fetched.portfolio.custom_bottom_color, '#FFD84D');
    assert.equal(fetched.portfolio.sub_components.hero_terminal_window, true);
    assert.equal(fetched.portfolio.sub_components.platform_youtube, false);
    assert.deepEqual(fetched.portfolio.custom_sections, reorderedSections);
  });

  it('Workflow 2: Antigravity History & Timeline Undo/Redo Verification', async () => {
    const testUsername = 'history_dev_' + Date.now();
    db.getOrCreatePortfolio(testUsername);

    // Snapshot 1
    const v1 = { title: 'Baseline Title v1', active_theme: 'monolith-dark' };
    await fetch(`${BASE_URL}/api/portfolio/${testUsername}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolio: v1, trigger: 'Initial Setup' })
    });

    // Snapshot 2
    const v2 = { title: 'Updated Title v2', active_theme: 'prism-electric' };
    await fetch(`${BASE_URL}/api/portfolio/${testUsername}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolio: v2, trigger: 'Theme Switch' })
    });

    // Undo via API
    const undoRes = await fetch(`${BASE_URL}/api/portfolio/${testUsername}/antigravity/undo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    assert.equal(undoRes.status, 200);
    const undoData = await undoRes.json();
    assert.equal(undoData.success, true);
    assert.equal(undoData.portfolio.title, 'Baseline Title v1');

    // Redo via API
    const redoRes = await fetch(`${BASE_URL}/api/portfolio/${testUsername}/antigravity/redo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    assert.equal(redoRes.status, 200);
    const redoData = await redoRes.json();
    assert.equal(redoData.success, true);
    assert.equal(redoData.portfolio.title, 'Updated Title v2');
  });

  it('Workflow 3: Client Proposal Personalization & Confidential Inspection', async () => {
    const username = 'sathasivamb';
    const clientName = 'Stripe Engineering';
    
    // 1. Create pitch
    const pitchRes = await fetch(`${BASE_URL}/api/client-pitch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        clientName,
        clientIndustry: 'Global Payments & Financial Infrastructure',
        customHeadline: 'Dedicated High-Throughput TypeScript & Rust Infrastructure Sprint'
      })
    });
    assert.equal(pitchRes.status, 200);
    const pitchData = await pitchRes.json();
    assert.equal(pitchData.success, true);
    const secretSlug = pitchData.pitch.secret_slug;
    assert.ok(secretSlug);

    // 2. Client visits confidential pitch page
    const viewRes = await fetch(`${BASE_URL}/api/pitch/${secretSlug}`);
    assert.equal(viewRes.status, 200);
    const viewData = await viewRes.json();
    assert.equal(viewData.success, true);
    assert.equal(viewData.pitch.client_name, clientName);
    assert.equal(viewData.portfolio.title, 'Dedicated High-Throughput TypeScript & Rust Infrastructure Sprint');

    // 3. Client submits retainer booking inquiry
    const inquiryRes = await fetch(`${BASE_URL}/api/client-inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        clientName: 'Patrick Collison',
        email: 'patrick@stripe.com',
        packageName: 'Dedicated Engineering Retainer ($4,800/mo)',
        projectDetails: 'We are expanding our payment ledger systems and need experienced systems engineers.'
      })
    });
    assert.equal(inquiryRes.status, 200);
    const inquiryData = await inquiryRes.json();
    assert.equal(inquiryData.success, true);
    assert.ok(inquiryData.message);
  });
});
