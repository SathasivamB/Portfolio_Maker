import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5001';

describe('Express REST API Endpoints & Functional Testing', () => {

  it('GET /api/health - returns 200 and healthy service status', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.ok(data.uptime >= 0);
    assert.ok(data.services);
    assert.equal(typeof data.services.github_oauth, 'boolean');
  });

  it('Security Headers - verifies X-Content-Type-Options, X-Frame-Options, X-XSS-Protection', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-frame-options'), 'SAMEORIGIN');
    assert.equal(res.headers.get('x-xss-protection'), '1; mode=block');
  });

  it('GET /api/auth/user/:username - returns user profile for existing users', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/user/sathasivamb`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.user.username, 'sathasivamb');
    assert.equal(data.user.provider, 'github');
  });

  it('GET /api/auth/user/:username - returns 404 for unknown user', async () => {
    const randomKey = 'ghost_user_' + Math.random().toString(36).substring(2, 8);
    const res = await fetch(`${BASE_URL}/api/auth/user/${randomKey}`);
    assert.equal(res.status, 404);

    const data = await res.json();
    assert.equal(data.success, false);
  });

  it('GET /api/portfolio/:username - returns structured portfolio with items and metrics', async () => {
    const res = await fetch(`${BASE_URL}/api/portfolio/sathasivamb`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.portfolio);
    assert.ok(Array.isArray(data.portfolio.items));
    assert.ok(data.portfolio.items.length > 0);
  });

  it('POST /api/portfolio/custom-setup - persists custom sections and subcomponents', async () => {
    const payload = {
      username: 'sathasivamb',
      config: {
        role: 'Principal Systems Architect',
        headline: 'Next-Gen Cloud Platforms',
        template: 'neural',
        topColor: '#0A0A12',
        bottomColor: '#7CFFB2',
        sections: [
          { id: 'hero', enabled: true },
          { id: 'projects', enabled: true },
          { id: 'skills', enabled: true }
        ],
        subComponents: {
          navbar_brand_logo: true,
          hero_terminal_window: true,
          hero_verified_badge: true
        }
      }
    };

    const res = await fetch(`${BASE_URL}/api/portfolio/custom-setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.portfolio);
    assert.equal(data.portfolio.custom_template, 'neural');
    assert.equal(data.portfolio.custom_role, 'Principal Systems Architect');
  });

  it('POST /api/ai/generate-template - synthesizes custom Figma archetype profile', async () => {
    const payload = {
      templateId: 'neural',
      username: 'sathasivamb',
      displayName: 'Sathasivam B'
    };

    const res = await fetch(`${BASE_URL}/api/ai/generate-template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.templateId, 'neural');
    assert.ok(data.blueprint, 'Response must contain archetype blueprint');
    assert.ok(data.blueprint.role);
    assert.ok(data.blueprint.headline);
    assert.ok(data.blueprint.bio);
    assert.ok(Array.isArray(data.blueprint.metrics));
    assert.ok(Array.isArray(data.blueprint.tools_arsenal || data.blueprint.tools));
  });

  it('POST /api/ai/copilot - action: message bio polish returns refined copy', async () => {
    const payload = {
      message: 'Rewrite this developer bio to be punchy, elite, recruiter-focused, and 2 sentences max:\n"Software engineer building systems."',
      context: {
        role: 'Full-Stack Developer',
        headline: 'Alex Morgan'
      }
    };

    const res = await fetch(`${BASE_URL}/api/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.response);
    assert.ok(data.response.length > 10, 'Response should contain bio suggestion');
  });

  it('POST /api/client-pitch and GET /api/pitch/:slug - creates and fetches confidential proposal', async () => {
    const clientName = 'Enterprise Beta Client ' + Math.floor(Math.random() * 1000);
    const createRes = await fetch(`${BASE_URL}/api/client-pitch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'sathasivamb',
        clientName,
        clientIndustry: 'FinTech & High Scale',
        customHeadline: 'Dedicated Systems Modernization Sprint'
      })
    });

    assert.equal(createRes.status, 200);
    const createData = await createRes.json();
    assert.equal(createData.success, true);
    assert.ok(createData.pitch.secret_slug);

    // Fetch proposal using slug
    const fetchRes = await fetch(`${BASE_URL}/api/pitch/${createData.pitch.secret_slug}`);
    assert.equal(fetchRes.status, 200);
    const fetchData = await fetchRes.json();
    assert.equal(fetchData.success, true);
    assert.equal(fetchData.pitch.client_name, clientName);
  });

  it('POST /api/client-inquiry - records prospect inquiry message', async () => {
    const payload = {
      username: 'sathasivamb',
      clientName: 'Sarah Jenkins',
      email: 'sjenkins@techcorp.io',
      packageName: 'Full-Stack Web App Sprint ($2,500)',
      projectDetails: 'Looking for a senior systems architect for a 3-month contract.'
    };

    const res = await fetch(`${BASE_URL}/api/client-inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.message);
  });

  it('GET /api/realtime/status/:username - reports real-time connection status', async () => {
    const res = await fetch(`${BASE_URL}/api/realtime/status/sathasivamb`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.username, 'sathasivamb');
    assert.equal(typeof data.activeViewers, 'number');
  });

  it('POST /api/user/subscription - activates 7-day Ultra Pro trial and persists features', async () => {
    const res = await fetch(`${BASE_URL}/api/user/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'sathasivamb',
        plan: 'trial_pro',
        billingCycle: 'monthly',
        deviceFingerprint: 'fp_test_device_123'
      })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.user.plan, 'trial_pro');
    assert.ok(data.subscription);
    assert.equal(data.subscription.status, 'active');
    assert.equal(data.subscription.features.copilot_unlimited, true);
    assert.equal(data.subscription.features.watermark_removed, true);
    assert.equal(data.subscription.features.vercel_deploy, true);
  });

  it('GET /api/user/subscription/:username - returns live countdown timer and remaining days', async () => {
    const res = await fetch(`${BASE_URL}/api/user/subscription/sathasivamb`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.subscription.plan, 'trial_pro');
    assert.equal(data.subscription.status, 'active');
    assert.ok(data.subscription.remaining_days >= 6);
    assert.ok(data.subscription.countdown_label.includes('remaining'));
    assert.equal(data.subscription.features.copilot_unlimited, true);
  });

  it('POST /api/extract-credentials - zero-OAuth credentials parser extracts badges', async () => {
    const res = await fetch(`${BASE_URL}/api/extract-credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://linkedin.com/in/sathasivamb'
      })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.certifications));
    assert.ok(data.certifications.length > 0);
    assert.ok(data.certifications[0].title);
  });

  it('GET /api/auth/github - initiates real OAuth 2.0 flow with 302 redirect and client_id', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/github`, { redirect: 'manual' });
    assert.equal(res.status, 302);
    const location = res.headers.get('location');
    assert.ok(location);
    assert.ok(location.startsWith('https://github.com/login/oauth/authorize'));
    assert.ok(location.includes('client_id='));
    assert.ok(location.includes('redirect_uri='));
    assert.ok(location.includes('scope='));
  });

  it('GET /api/auth/google - initiates real OAuth 2.0 flow with 302 redirect and client_id', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/google`, { redirect: 'manual' });
    assert.equal(res.status, 302);
    const location = res.headers.get('location');
    assert.ok(location);
    assert.ok(location.startsWith('https://accounts.google.com/o/oauth2/v2/auth'));
    assert.ok(location.includes('client_id='));
    assert.ok(location.includes('redirect_uri='));
    assert.ok(location.includes('response_type=code'));
  });

  it('POST /api/auth/one-click-ingest - verifies user, portfolio, and items saved to SQLite database', async () => {
    const testHandle = 'oauth_test_' + Date.now();
    const res = await fetch(`${BASE_URL}/api/auth/one-click-ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'github',
        identifier: testHandle
      })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.user.username, testHandle);
    assert.equal(data.user.plan, 'trial_pro');
    assert.ok(data.portfolio);

    // Verify user is persisted in backend DB
    const userRes = await fetch(`${BASE_URL}/api/auth/user/${testHandle}`);
    assert.equal(userRes.status, 200);
    const userData = await userRes.json();
    assert.equal(userData.success, true);
    assert.equal(userData.user.username, testHandle);
    assert.ok(userData.portfolio);
  });

  it('POST /api/auth/credentials - creates user and persists to SQLite database', async () => {
    const testEmail = `oauth_cred_${Date.now()}@domain.com`;
    const res = await fetch(`${BASE_URL}/api/auth/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Connor',
        email: testEmail,
        password: 'Password123!'
      })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.user.email, testEmail);
    assert.equal(data.user.plan, 'trial_pro');
    assert.ok(data.user.username);

    // Verify user can be fetched from DB
    const verifyRes = await fetch(`${BASE_URL}/api/auth/user/${data.user.username}`);
    assert.equal(verifyRes.status, 200);
    const verifyData = await verifyRes.json();
    assert.equal(verifyData.success, true);
    assert.equal(verifyData.user.email, testEmail);
  });
});
