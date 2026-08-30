import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Footer({ onAuthClick }) {
  return (
    <footer className="relative bg-[#050608] text-gray-400 pt-20 pb-12 px-6 sm:px-12 border-t border-white/5 overflow-hidden z-10">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          {/* Left Column: Brand Info */}
          <div className="md:col-span-4 flex flex-col justify-start">
            <div className="flex items-center gap-2.5 mb-4 text-white">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-extrabold text-lg shadow-md">
                S
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                ScholarAI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
              Empowering students across India with intelligent, verified scholarship discovery and AI-powered eligibility verification.
            </p>
            <p className="text-xs text-gray-400">
              © copyright ScholarAI 2026. All rights reserved.
            </p>
          </div>

          {/* Right Columns: Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs sm:text-sm">
            {/* Pages Column */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Pages
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#hero" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#scholarships" className="hover:text-white transition-colors">
                    All Scholarships
                  </a>
                </li>
                <li>
                  <a href="#why-us" className="hover:text-white transition-colors">
                    Why Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Socials Column */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Socials
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    Twitter / X
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Register Column */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Register
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => onAuthClick?.('signup')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Sign Up
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onAuthClick?.('signin')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onAuthClick?.('signin')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Forgot Password
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Giant Subtle Background Watermark Text across Bottom */}
      <div className="w-full flex justify-center items-center pointer-events-none select-none overflow-hidden pt-8 pb-4">
        <span className="text-[14vw] font-extrabold tracking-tighter text-white/[0.04] leading-none whitespace-nowrap">
          ScholarAI
        </span>
      </div>
    </footer>
  );
}
