import React, { useState } from 'react';
import { Shield, KeyRound, Lock, QrCode, ArrowRight, Loader2, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';
import { login, verify2FA } from '../lib/api';

export default function LoginScreen({ onLoginSuccess }) {
  const [step, setStep] = useState(1); // 1: Password, 2: 2FA TOTP
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('baitshield2024');
  const [totpCode, setTotpCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login(username, password);
      if (res.error) {
        setError(res.error);
      } else {
        setQrCodeUrl(res.qrCodeUrl);
        setSecret(res.secret);
        setStep(2);
      }
    } catch (err) {
      setError('Connection to auth server failed');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    if (!totpCode || totpCode.length < 6) {
      setError('Please enter valid 6-digit Google Authenticator code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await verify2FA(totpCode, secret);
      if (res.error) {
        setError(res.error);
      } else if (res.status === 'authenticated') {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError('2FA Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCode = () => {
    setTotpCode('123456');
    setError('');
  };

  return (
    <div className="min-h-screen bg-bg text-text font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        {/* Screen Header */}
        <div className="p-8 border-b border-border text-center bg-bg/40">
          <div className="w-14 h-14 bg-accent/10 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">BaitShield SOC</h1>
          <p className="text-xs text-muted mt-1">Deception Cybersecurity Console</p>
        </div>

        {/* Screen Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-high/10 border border-high/30 p-3 rounded-lg flex items-center gap-2 text-xs text-high animate-[fadeIn_0.2s_ease-out]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Username & Password Login */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-bg border border-border text-white text-sm rounded-lg p-3 pl-10 focus:outline-none focus:border-accent font-mono"
                    placeholder="admin"
                  />
                  <Shield className="w-4 h-4 text-muted absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-bg border border-border text-white text-sm rounded-lg p-3 pl-10 focus:outline-none focus:border-accent font-mono"
                    placeholder="••••••••••••"
                  />
                  <Lock className="w-4 h-4 text-muted absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-[#ff8533] text-white py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span>Continue to 2FA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center mt-3 text-[11px] text-muted">
                Demo Credentials: <code className="text-accent font-mono">admin</code> / <code className="text-accent font-mono">baitshield2024</code>
              </div>
            </form>
          ) : (
            /* STEP 2: Google Authenticator 2FA TOTP */
            <form onSubmit={handle2FASubmit} className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
              <div className="text-center">
                <span className="bg-accent/10 text-accent border border-accent/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Two-Factor Security Enforced
                </span>
                <h2 className="text-base font-bold text-white mt-2 flex items-center justify-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-accent" />
                  Google Authenticator 2FA
                </h2>
              </div>

              {/* QR Code Container */}
              {qrCodeUrl && (
                <div className="bg-white p-3 rounded-xl w-36 h-36 mx-auto flex items-center justify-center border-2 border-accent shadow-md">
                  <img src={qrCodeUrl} alt="Google Authenticator QR Code" className="w-full h-full" />
                </div>
              )}

              <div className="text-center text-xs text-muted">
                Scan QR Code with Google Authenticator or entry 6-digit code
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2 text-center">
                  Enter 6-Digit TOTP Code
                </label>
                <div className="relative max-w-[220px] mx-auto">
                  <input
                    type="text"
                    maxLength="6"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-bg border-2 border-accent/60 text-accent text-center text-xl font-bold font-mono tracking-[0.4em] rounded-lg p-2.5 focus:outline-none focus:border-accent"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={fillDemoCode}
                  className="flex-1 bg-bg hover:bg-border text-muted hover:text-white border border-border py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  Quick Demo Code (123456)
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-[#ff8533] text-white py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying 2FA Code...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Verify 2FA & Launch Console
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs text-muted hover:text-white transition-colors"
              >
                ← Back to Password Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
