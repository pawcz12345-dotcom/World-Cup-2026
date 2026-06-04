'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  username: string;
}

const navLinks = [
  { href: '/app/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/app/picks/groups', label: 'Group Picks', icon: '📋' },
  { href: '/app/picks/bracket', label: 'Bracket', icon: '🏆' },
  { href: '/app/picks/champion', label: 'Champion', icon: '⭐' },
  { href: '/app/scores', label: 'Live Scores', icon: '⚽' },
  { href: '/app/standings', label: 'Standings', icon: '📊' },
];

export default function Navbar({ username }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <nav className="bg-wc-green-900 border-b border-wc-green-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <span className="text-wc-gold-400 font-bold text-lg hidden sm:block">
              WC 2026 Pool
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'bg-wc-gold-500 text-wc-green-950'
                    : 'text-wc-green-200 hover:bg-wc-green-800 hover:text-white'
                }`}
              >
                <span className="mr-1">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* User & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-wc-green-300 text-sm">
              👤 {username}
            </span>
            <button
              onClick={handleLogout}
              className="text-wc-green-400 hover:text-white text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-wc-green-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  pathname === link.href
                    ? 'bg-wc-gold-500 text-wc-green-950'
                    : 'text-wc-green-200 hover:bg-wc-green-800'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-wc-green-700 flex items-center justify-between">
              <span className="text-wc-green-400 text-sm px-3">👤 {username}</span>
              <button
                onClick={handleLogout}
                className="text-wc-green-400 hover:text-white text-sm px-3 py-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
