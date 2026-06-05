'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        router.push('/app/dashboard');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 75% 15%, rgba(0,157,218,0.14) 0%, transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(0,166,72,0.09) 0%, transparent 45%), #02071A',
      }}
    >
      {/* Decorative orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-wc-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-wc-green-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Rainbow stripe at top */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-wc-blue-500 via-wc-green-500 to-wc-red-500 z-10" />

      <div className="w-full max-w-sm relative z-0">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-wc-blue-500 to-wc-blue-700 mb-5 shadow-2xl shadow-wc-blue-900/60">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 2c1.85 0 3.56.63 4.93 1.68L5.68 16.93A7.95 7.95 0 014 12c0-4.41 3.59-8 8-8zm0 16a7.95 7.95 0 01-4.93-1.68L18.32 7.07A7.95 7.95 0 0120 12c0 4.41-3.59 8-8 8z"/>
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight">World Cup 2026</h1>
          <p className="text-wc-navy-400 text-xs mt-2 tracking-[0.15em] uppercase font-semibold">Join the Pool</p>
        </div>

        {/* Card */}
        <div className="relative bg-wc-navy-900/90 backdrop-blur-sm border border-wc-navy-700/80 rounded-2xl p-7 shadow-2xl shadow-black/60">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-wc-green-600 to-wc-green-400 rounded-t-2xl" style={{ borderRadius: '16px 16px 0 0' }} />

          <h2 className="text-xl font-black text-white mb-6">Create account</h2>

          {error && (
            <div className="bg-wc-red-700/15 border border-wc-red-600/40 text-wc-red-300 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="3–20 characters"
                required
                minLength={3}
                maxLength={20}
                autoComplete="username"
                autoFocus
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Min. 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="field-label">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account…
                </>
              ) : (
                'Create account →'
              )}
            </button>
          </form>

          <p className="text-center text-wc-navy-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-wc-blue-400 hover:text-wc-blue-300 font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Host nations */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {[
            { flag: '🇺🇸', name: 'USA' },
            { flag: '🇨🇦', name: 'Canada' },
            { flag: '🇲🇽', name: 'Mexico' },
          ].map(({ flag, name }) => (
            <div key={name} className="flex flex-col items-center gap-1 opacity-35">
              <span className="text-2xl">{flag}</span>
              <span className="text-[10px] text-wc-navy-500 font-semibold tracking-wider uppercase">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
