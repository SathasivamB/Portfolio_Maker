import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CreatorStudio from './pages/CreatorStudio';
import PublicPortfolio from './pages/PublicPortfolio';
import PortfolioSetupWizard from './components/PortfolioSetupWizard';
import SaaSPricingModal from './components/SaaSPricingModal';
import NotFoundPage from './pages/NotFoundPage';
import ServerErrorPage from './pages/ServerErrorPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_studio_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authPathway, setAuthPathway] = useState('placements'); // 'placements' | 'creators'
  const [selectedInitialTemplate, setSelectedInitialTemplate] = useState('monolith');
  const [sandboxPreferences, setSandboxPreferences] = useState(null);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [wizardOrigin, setWizardOrigin] = useState('onboarding'); // 'onboarding' | 'studio'
  const [showSaaSPricing, setShowSaaSPricing] = useState(false);

  const isSetupCompleted = (user) => {
    if (!user) return false;
    if (user.username === 'alexchen' || user.username === 'sathasivamb') return true;
    return Boolean(user.setup_completed);
  };

  const [route, setRoute] = useState(() => getRouteInfo());

  function getRouteInfo() {
    let path = window.location.pathname;

    function sanitizeHandle(raw) {
      if (!raw) return 'alexchen';
      let clean = raw.replace(/^:/, '').replace(/^@/, '').trim();
      if (!clean || clean.toLowerCase() === 'username') {
        return 'alexchen';
      }
      return clean;
    }

    // Pitch Route: /pitch/:slug
    if (path.startsWith('/pitch/')) {
      const slug = path.replace('/pitch/', '').split('/')[0];
      return { type: 'pitch', slug };
    }

    // Public Creator Profile Routes:
    // Support /u/:username, /p/:username, /portfolio/:username, /@:username
    if (path.startsWith('/u/')) {
      const raw = path.replace('/u/', '').split('/')[0];
      return { type: 'public', username: sanitizeHandle(raw) };
    }

    if (path.startsWith('/p/')) {
      const raw = path.replace('/p/', '').split('/')[0];
      return { type: 'public', username: sanitizeHandle(raw) };
    }

    if (path.startsWith('/portfolio/')) {
      const raw = path.replace('/portfolio/', '').split('/')[0];
      return { type: 'public', username: sanitizeHandle(raw) };
    }

    if (path.startsWith('/@')) {
      const raw = path.replace('/@', '').split('/')[0];
      return { type: 'public', username: sanitizeHandle(raw) };
    }

    // Explicit Auth Routes
    if (path === '/auth' || path === '/login' || path === '/signup') {
      return { type: 'auth' };
    }

    // Explicit Studio Route
    if (path === '/studio') {
      return { type: 'studio' };
    }

    // Explicit 404 & Error Routes
    if (path === '/404' || path === '/not-found') {
      return { type: '404' };
    }
    if (path === '/500' || path === '/error') {
      return { type: '500' };
    }

    // Direct root paths like /sathasivamb or /alexchen
    const cleanPath = path.replace(/^\//, '').split('/')[0];
    const systemPaths = ['studio', 'login', 'signup', 'auth', '404', 'not-found', '500', 'error', 'index.html', ''];
    if (cleanPath && !systemPaths.includes(cleanPath)) {
      return { type: 'public', username: sanitizeHandle(cleanPath) };
    }

    // Explicit home / landing query parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'home' || params.get('view') === 'landing') {
      return { type: 'landing' };
    }

    // Root path: If logged in, go to studio; else go to landing showcase
    const saved = localStorage.getItem('portfolio_studio_user');
    return saved ? { type: 'studio' } : { type: 'landing' };
  }

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRouteInfo());
    };
    const handleAppNavigate = (e) => {
      if (e.detail?.url) {
        window.history.pushState({}, '', e.detail.url);
      }
      setRoute(getRouteInfo());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('app:navigate', handleAppNavigate);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('app:navigate', handleAppNavigate);
    };
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('portfolio_studio_user', JSON.stringify(user));
    } catch {}

    // Check if user had selected a pending trial plan before authenticating
    let pendingPlan = null;
    try {
      pendingPlan = sessionStorage.getItem('pending_saas_plan');
      if (pendingPlan) sessionStorage.removeItem('pending_saas_plan');
    } catch {}

    if (pendingPlan) {
      handleSelectSaaSPlan(pendingPlan, user);
      return;
    }

    // Open the Inch-by-Inch Blueprint Setup Wizard in onboarding mode
    setWizardOrigin('onboarding');
    setShowSetupWizard(true);
    setRoute({ type: 'studio' });
  };

  const handleWizardComplete = (updatedUser, updatedPortfolio) => {
    setShowSetupWizard(false);
    setShowSaaSPricing(false);
    const completedUser = {
      ...(updatedUser || currentUser),
      setup_completed: true
    };
    setCurrentUser(completedUser);
    try {
      localStorage.setItem('portfolio_studio_user', JSON.stringify(completedUser));
    } catch {}
    // Frictionless Beta: Grant all-access beta pass directly without modal gate
    handleSelectSaaSPlan('beta_pro', completedUser);
    window.history.pushState({}, '', '/studio');
    setRoute({ type: 'studio' });
  };

  const handleWizardClose = () => {
    setShowSetupWizard(false);
    if (wizardOrigin === 'onboarding' || !isSetupCompleted(currentUser)) {
      window.history.pushState({}, '', '/?view=home');
      setRoute({ type: 'landing' });
    }
  };

  const handleSelectSaaSPlan = async (planId, userOverride = null) => {
    setShowSaaSPricing(false);
    const chosenPlan = planId || 'trial_pro';
    const effectiveUser = userOverride || currentUser;

    // If an anonymous guest selects a trial/plan, guide them to authenticate first
    if (!effectiveUser) {
      try {
        sessionStorage.setItem('pending_saas_plan', chosenPlan);
      } catch {}
      setAuthPathway('trial');
      window.history.pushState({}, '', `/auth?action=trial&plan=${chosenPlan}`);
      setRoute({ type: 'auth' });
      return;
    }

    const now = Date.now();
    const trialDurationMs = 90 * 24 * 60 * 60 * 1000; // 90 days Public Beta Access
    const baseUser = effectiveUser;

    const trialStartedAt = baseUser.trial_started_at || new Date(now).toISOString();
    const trialExpiresAt = baseUser.trial_expires_at || new Date(now + trialDurationMs).toISOString();

    const updatedUser = {
      ...baseUser,
      plan: chosenPlan,
      trial_started_at: trialStartedAt,
      trial_expires_at: trialExpiresAt,
      subscription: {
        plan: chosenPlan,
        status: 'active',
        trial_started_at: trialStartedAt,
        trial_expires_at: trialExpiresAt,
        features: {
          copilot_unlimited: true,
          custom_domain: true,
          vercel_deploy: true,
          omni_scraper: true,
          analytics_unlocked: true,
          watermark_removed: true
        }
      }
    };

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('portfolio_studio_user', JSON.stringify(updatedUser));
    } catch {}

    try {
      const res = await fetch('/api/user/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: updatedUser.username, 
          plan: chosenPlan 
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        const synced = { ...updatedUser, ...data.user, subscription: data.subscription };
        setCurrentUser(synced);
        try {
          localStorage.setItem('portfolio_studio_user', JSON.stringify(synced));
        } catch {}
      }
    } catch (e) {
      console.warn('Subscription sync error:', e);
    }

    // Direct instant navigation to studio
    window.history.pushState({}, '', '/studio');
    setRoute({ type: 'studio' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowSetupWizard(false);
    setShowSaaSPricing(false);
    try {
      localStorage.removeItem('portfolio_studio_user');
    } catch {}
    window.history.pushState({}, '', '/');
    setRoute({ type: 'landing' });
  };

  // Route: Public Pitch View
  if (route.type === 'pitch') {
    return <PublicPortfolio pitchSlug={route.slug} />;
  }

  // Route: Public Portfolio Creator View
  if (route.type === 'public') {
    return <PublicPortfolio username={route.username} />;
  }

  // Route: 404 Not Found Page
  if (route.type === '404') {
    return (
      <NotFoundPage 
        onGoHome={() => {
          window.history.pushState({}, '', '/');
          setRoute(currentUser ? { type: 'studio' } : { type: 'landing' });
        }}
        onExplore={() => {
          window.history.pushState({}, '', '/#templates');
          setRoute({ type: 'landing' });
        }}
      />
    );
  }

  // Route: 500 Server Error Page
  if (route.type === '500') {
    return (
      <ServerErrorPage 
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Route: Step 0 - The Master Showcase Landing Page
  if (route.type === 'landing') {
    return (
      <>
        <LandingPage
          user={currentUser}
          onResumeSetup={() => {
            setWizardOrigin('onboarding');
            setShowSetupWizard(true);
            setRoute({ type: 'studio' });
          }}
          onGoToStudio={isSetupCompleted(currentUser) ? () => {
            setShowSetupWizard(false);
            window.history.pushState({}, '', '/studio');
            setRoute({ type: 'studio' });
          } : null}
          onLogout={handleLogout}
          onStartPlacements={(templateId, preferences) => {
            if (currentUser) {
              if (templateId) setSelectedInitialTemplate(templateId);
              if (preferences) setSandboxPreferences(preferences);
              setWizardOrigin('onboarding');
              setShowSetupWizard(true);
              setRoute({ type: 'studio' });
              return;
            }
            if (templateId) setSelectedInitialTemplate(templateId);
            if (preferences) setSandboxPreferences(preferences);
            setAuthPathway('placements');
            window.history.pushState({}, '', '/auth');
            setRoute({ type: 'auth' });
          }}
          onStartCreators={(templateId) => {
            if (currentUser) {
              if (templateId) setSelectedInitialTemplate(templateId);
              setWizardOrigin('onboarding');
              setShowSetupWizard(true);
              setRoute({ type: 'studio' });
              return;
            }
            if (templateId) setSelectedInitialTemplate(templateId);
            setAuthPathway('creators');
            window.history.pushState({}, '', '/auth');
            setRoute({ type: 'auth' });
          }}
          onOpenLogin={() => {
            setAuthPathway('placements');
            window.history.pushState({}, '', '/login');
            setRoute({ type: 'auth' });
          }}
          onOpenPricing={() => setShowSaaSPricing(true)}
        />
        {showSaaSPricing && (
          <SaaSPricingModal
            user={currentUser}
            onSelectPlan={handleSelectSaaSPlan}
            onClose={() => setShowSaaSPricing(false)}
          />
        )}
      </>
    );
  }

  // Route: Step 1 - Real-Time OAuth & Ingestion Gateway
  if (route.type === 'auth' || !currentUser) {
    return (
      <AuthPage 
        initialPathway={authPathway}
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => {
          window.history.pushState({}, '', '/');
          setRoute({ type: 'landing' });
        }}
      />
    );
  }

  // Route: Studio & Logged-in Experience
  // COMPULSORY CHECK: If user has NOT completed setup, lock them out of the studio and show the mandatory wizard!
  if (!isSetupCompleted(currentUser)) {
    return (
      <div className="fixed inset-0 bg-[#0A0A12] flex items-center justify-center p-2 sm:p-4">
        <PortfolioSetupWizard
          user={currentUser}
          initialTemplateId={selectedInitialTemplate}
          initialPreferences={sandboxPreferences}
          isFromStudio={false}
          onComplete={handleWizardComplete}
          onClose={handleWizardClose}
        />
      </div>
    );
  }

  return (
    <>
      <CreatorStudio 
        user={currentUser} 
        onLogout={handleLogout} 
        onOpenSetupWizard={(currentTpl) => {
          if (currentTpl) setSelectedInitialTemplate(currentTpl);
          setWizardOrigin('studio');
          setShowSetupWizard(true);
        }}
        onOpenPricing={() => setShowSaaSPricing(true)}
      />

      {/* Step 2: Customization / Blueprint Wizard for completed users */}
      {showSetupWizard && (
        <PortfolioSetupWizard
          user={currentUser}
          initialTemplateId={selectedInitialTemplate}
          initialPreferences={sandboxPreferences}
          isFromStudio={wizardOrigin === 'studio'}
          onComplete={handleWizardComplete}
          onClose={handleWizardClose}
        />
      )}

      {/* Step 3: SaaS Monetization & 7-Day Ultra Pro Trial Gateway */}
      {showSaaSPricing && (
        <SaaSPricingModal
          user={currentUser}
          onSelectPlan={handleSelectSaaSPlan}
          onClose={() => setShowSaaSPricing(false)}
        />
      )}
    </>
  );
}
