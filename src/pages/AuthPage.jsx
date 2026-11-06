import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft,
  X,
  ShieldCheck,
  Check,
  ExternalLink
} from 'lucide-react';
import { GithubIcon, GoogleIcon, LinkedinIcon } from '../components/Icons';
import AgentFolioLogo from '../components/AgentFolioLogo';
import LegalModal from '../components/LegalModal';

export default function AuthPage({ onLoginSuccess, initialPathway = 'placements', onBackToLanding }) {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [activeOAuthProvider, setActiveOAuthProvider] = useState(null); // 'github' | 'google' | null
  const [legalModalTab, setLegalModalTab] = useState(null); // 'privacy' | 'terms' | null
  const isTrialIntent = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('action') === 'trial' || 
    new URLSearchParams(window.location.search).get('action') === 'beta' || 
    initialPathway === 'trial' ||
    isSignUp
  );

  // Handle Claim Query (from 404 page: /auth?claim=handle)
  const claimParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('claim') : null;
  const cleanClaim = claimParam ? claimParam.replace(/[^a-z0-9_-]/gi, '').toLowerCase() : '';
  const [claimHandle, setClaimHandle] = useState(() => cleanClaim);

  useEffect(() => {
    if (cleanClaim) {
      setIsSignUp(true);
    }
  }, [cleanClaim]);

  // Handle return from real OAuth 2.0 callback and popup window messages
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'OAUTH_SUCCESS' && e.data.username) {
        setIsLoading(true);
        setActiveOAuthProvider(null);
        fetch(`/api/auth/user/${e.data.username}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user) {
              setSuccess(true);
              setTimeout(() => {
                onLoginSuccess(data.user);
              }, 400);
            }
          })
          .catch(err => {
            setError(err.message || 'Failed to retrieve authenticated session.');
            setIsLoading(false);
          });
      } else if (e.data && e.data.type === 'OAUTH_ERROR') {
        setError(e.data.error || 'Authentication cancelled.');
        setIsLoading(false);
        setActiveOAuthProvider(null);
      }
    };
    window.addEventListener('message', handleMessage);

    const params = new URLSearchParams(window.location.search);
    const oauthSuccess = params.get('oauth_success');
    const username = params.get('username');
    const oauthError = params.get('error');

    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      window.history.replaceState({}, '', window.location.pathname);
      return () => window.removeEventListener('message', handleMessage);
    }

    if (oauthSuccess === 'true' && username) {
      setIsLoading(true);

      fetch(`/api/auth/user/${username}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setSuccess(true);
            window.history.replaceState({}, '', window.location.pathname);
            setTimeout(() => {
              onLoginSuccess(data.user);
            }, 400);
          } else {
            throw new Error(data.error || 'Failed to retrieve authenticated session.');
          }
        })
        .catch(err => {
          setError(err.message || 'Failed to retrieve authenticated session.');
          setIsLoading(false);
        });
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [onLoginSuccess]);

  // Launch Official Provider OAuth Window (popup with automatic fallback)
  const handleOfficialOAuth = (provider) => {
    setError('');
    setIsLoading(true);
    setActiveOAuthProvider(provider);

    const origin = encodeURIComponent(window.location.origin);
    const oauthUrl = `/api/auth/${provider}?origin=${origin}`;

    const width = 580;
    const height = 720;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    try {
      const popup = window.open(
        oauthUrl,
        `Folio_${provider}_OAuth`,
        `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no,scrollbars=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        window.location.href = oauthUrl;
      } else {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            setIsLoading(false);
            setActiveOAuthProvider(null);
          }
        }, 800);
      }
    } catch {
      window.location.href = oauthUrl;
    }
  };

  // Traditional Form Submit (Email / Password) - Persisted to Database with Strong Security
  const handleSubmitCredentials = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    if (isSignUp && (!fullName || !fullName.trim())) {
      setError('Please enter your full name to create an account.');
      return;
    }

    if (isSignUp && password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isSignUp ? 'signup' : 'login',
          isSignUp,
          name: fullName.trim(),
          email: email.trim(),
          password: password.trim(),
          username: claimHandle ? claimHandle.trim().toLowerCase() : undefined
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 400);
      } else {
        throw new Error(data.error || 'Authentication error.');
      }
    } catch (err) {
      setError(err.message || 'Unable to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] text-[#0A0A12] font-['DM_Sans'] flex flex-col justify-between p-6 relative overflow-x-hidden selection:bg-[#FFD84D] selection:text-[#0A0A12]">
      
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 z-20">
        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="pill b2 flex items-center gap-2 text-xs font-bold min-h-[38px] px-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="tg bg-[#7CFFB2] text-[#0A0A12] font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Beta Release · Encrypted
          </span>
        </div>
      </header>

      {/* Main Centered Sign In / Sign Up Card (Folio AI v2) */}
      <main className="flex-1 flex items-center justify-center my-8 z-20">
        <div className="bx w-full max-w-[440px] p-5 sm:p-8 border-2 border-[#0A0A12] shadow-neo flex flex-col gap-5 rounded-[24px] bg-white">
          
          {/* Brand Mark */}
          <div className="flex items-center gap-2.5">
            <AgentFolioLogo />
          </div>

          <div>
            <h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-[#0A0A12]">
              {isSignUp ? 'Create your portfolio' : 'Welcome back'}
            </h1>
            <p className="text-xs text-[#55586B] mt-1 font-['DM_Sans']">
              {isSignUp ? 'Import your work and publish in seconds.' : 'Sign in to access your portfolio studio.'}
            </p>
          </div>

          {/* Handle Claim Banner from 404 */}
          {claimHandle && (
            <div className="p-3 bg-[#E8ECFF] border-2 border-[#0A0A12] rounded-[16px] text-xs flex items-center gap-2.5 shadow-neo-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7CFFB2] border border-[#0A0A12] animate-ping flex-shrink-0" />
              <div>
                <span className="font-bold text-[#0A0A12]">Claiming @{claimHandle}:</span>
                <span className="text-[#55586B] ml-1">This handle is available! Sign up below to reserve your custom portfolio URL.</span>
              </div>
            </div>
          )}

          {/* Public Beta All-Access Banner */}
          {isTrialIntent && (
            <div className="p-3 bg-[#7CFFB2]/25 border-2 border-[#0A0A12] rounded-[16px] text-xs flex items-center gap-2.5 shadow-neo-sm">
              <Sparkles className="w-4 h-4 text-[#2340FF] flex-shrink-0" />
              <div>
                <span className="font-bold text-[#0A0A12]">Public Beta Pass Active:</span>
                <span className="text-[#55586B] ml-1">Connect your GitHub or sign in to activate full unrestricted access across all 12 templates immediately.</span>
              </div>
            </div>
          )}

          {/* Social / OAuth Buttons (Official OAuth 2.0 Direct Flows) */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => handleOfficialOAuth('github')}
              disabled={isLoading}
              className="pill b2 w-full justify-center gap-2.5 min-h-[46px] text-sm font-bold shadow-neo-sm hover:bg-[#F3F4F8] transition-all cursor-pointer disabled:opacity-60"
            >
              <GithubIcon className="w-4 h-4" />
              <span>
                {isLoading && activeOAuthProvider === 'github'
                  ? 'Connecting to GitHub...'
                  : 'Continue with GitHub'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOfficialOAuth('google')}
              disabled={isLoading}
              className="pill b2 w-full justify-center gap-2.5 min-h-[46px] text-sm font-bold shadow-neo-sm hover:bg-[#F3F4F8] transition-all cursor-pointer disabled:opacity-60"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>
                {isLoading && activeOAuthProvider === 'google'
                  ? 'Connecting to Google...'
                  : 'Continue with Google'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t-2 border-[#0A0A12]/15"></div>
            <span className="text-xs text-[#55586B] font-bold uppercase">or</span>
            <div className="flex-1 border-t-2 border-[#0A0A12]/15"></div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmitCredentials} className="flex flex-col gap-3.5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-[#55586B] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required={isSignUp}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="in w-full text-sm font-medium"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#55586B] uppercase mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="in w-full text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#55586B] uppercase mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="in w-full text-sm pr-10 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#55586B] hover:text-[#0A0A12]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-[12px] bg-[#FDF2F2] border-2 border-[#EF4444] text-xs text-[#EF4444] flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="pill b1 w-full justify-center min-h-[46px] text-sm font-bold shadow-neo hover:translate-x-0.5 mt-1 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : isSignUp ? (
                'Create account'
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Toggle between Sign In & Sign Up */}
          <div className="text-center pt-2 border-t-2 border-[#0A0A12]/15">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-xs text-[#55586B] hover:text-[#0A0A12] font-medium"
            >
              {isSignUp ? (
                <span>Already have an account? <strong className="text-[#2340FF] font-bold">Sign in</strong></span>
              ) : (
                <span>New here? <strong className="text-[#2340FF] font-bold">Build my portfolio</strong></span>
              )}
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto py-3 flex items-center justify-between text-xs text-[#55586B] border-t-2 border-[#0A0A12]/15 z-20 font-['DM_Sans']">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="tg bg-[#7CFFB2] text-[#0A0A12] text-[10px] font-bold">Public Beta</span>
          <span>© 2026 folio.ai</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => setLegalModalTab('privacy')} 
            className="hover:text-[#0A0A12] transition-colors cursor-pointer underline-offset-2 hover:underline"
          >
            Privacy
          </button>
          <button 
            type="button" 
            onClick={() => setLegalModalTab('terms')} 
            className="hover:text-[#0A0A12] transition-colors cursor-pointer underline-offset-2 hover:underline"
          >
            Terms
          </button>
        </div>
      </footer>

      {/* Legal & Privacy Policy Modal */}
      {legalModalTab && (
        <LegalModal
          initialTab={legalModalTab}
          onClose={() => setLegalModalTab(null)}
        />
      )}

    </div>
  );
}
