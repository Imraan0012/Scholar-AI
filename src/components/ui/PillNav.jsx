import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, User, ArrowRight, LogOut, LayoutDashboard, UserPlus } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PillNav({
  logo,
  logoAlt = "Scholar AI Logo",
  brandText = "Scholar AI",
  items = [
    { label: 'Home', href: '#hero' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Scholarships', href: '#scholarships' },
    { label: 'Why Us', href: '#why-us' }
  ],
  activeHref = '#hero',
  className,
  baseColor = "#0f111a",
  pillColor = "#ffffff",
  hoveredPillTextColor = "#000000",
  pillTextColor = "#ffffff",
  currentUser,
  onAuthClick,
  onCheckEligibilityClick,
  onNavClick,
  onGoToDashboard,
  onLogout
}) {
  const [active, setActive] = useState(activeHref);
  const [hovered, setHovered] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href) => {
    setActive(href);
    setMobileMenuOpen(false);
    if (onNavClick) {
      onNavClick(href);
    } else {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center pt-3 sm:pt-4 px-4 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto flex items-center justify-between gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-full border border-white/10 shadow-2xl transition-all duration-300 max-w-4xl w-full mx-auto",
          scrolled ? "bg-[#0b0d14]/90 border-white/15 shadow-black/60" : "bg-[#0f111a]/75 border-white/10",
          className
        )}
        style={{ backgroundColor: scrolled ? 'rgba(11, 13, 20, 0.9)' : undefined }}
      >
        {/* Brand Logo & Name */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#hero');
          }}
          className="flex items-center gap-2 pl-2.5 pr-2 py-0.5 text-white group"
        >
          {logo ? (
            <img src={logo} alt={logoAlt} className="w-5 h-5 object-contain group-hover:rotate-12 transition-transform duration-300" />
          ) : (
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="font-bold tracking-tight text-sm sm:text-base text-white group-hover:text-indigo-300 transition-colors">
            {brandText}
          </span>
        </a>

        {/* Desktop Nav Items with Sliding Pill Indicator */}
        <div className="hidden md:flex items-center relative rounded-full p-0.5 bg-black/30 border border-white/5">
          {items.map((item) => {
            const isCurrent = active === item.href;
            const isHovered = hovered === item.href;

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "relative px-3.5 py-1 text-xs font-medium rounded-full transition-colors duration-200 z-10 select-none",
                  isCurrent ? "text-black" : "text-gray-300 hover:text-white"
                )}
              >
                {/* Active Pill Indicator */}
                {isCurrent && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full shadow-md z-[-1]"
                    style={{ backgroundColor: pillColor }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}

                {/* Hover Indicator if not active */}
                {!isCurrent && isHovered && (
                  <motion.div
                    layoutId="hover-pill"
                    className="absolute inset-0 rounded-full bg-white/10 z-[-1]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }}
                  />
                )}

                {item.label}
              </a>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pr-1">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onGoToDashboard}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 px-3.5 sm:px-4 py-2 rounded-full transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="text-xs font-semibold text-gray-400 hover:text-rose-400 px-3 py-2 rounded-full transition-colors flex items-center gap-1 hover:bg-rose-500/10 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Sign In button */}
              <button
                onClick={() => onAuthClick?.('signin')}
                className="text-xs sm:text-sm font-semibold text-gray-200 hover:text-white px-3 sm:px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5 hover:bg-white/10 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
              </button>

              {/* Sign Up / Create Account button */}
              <button
                onClick={() => onAuthClick?.('signup')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-white text-black hover:bg-slate-100 px-3.5 sm:px-4 py-2 rounded-full transition-all shadow-md hover:shadow-cyan-500/20 active:scale-95 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white rounded-full bg-white/5 border border-white/10 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-20 left-4 right-4 bg-[#0d0f17]/95 border border-white/15 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl md:hidden max-w-sm mx-auto flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1.5">
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.href);
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between",
                    active === item.href ? "bg-white text-black font-semibold" : "text-gray-300 hover:bg-white/5"
                  )}
                >
                  <span>{item.label}</span>
                  {active === item.href && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onGoToDashboard?.();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl font-semibold text-sm shadow-lg flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full py-2.5 bg-white/5 text-rose-300 hover:bg-rose-500/10 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onAuthClick?.('signup');
                    }}
                    className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up / Create Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onAuthClick?.('signin');
                    }}
                    className="w-full py-2.5 bg-white/5 text-gray-200 hover:bg-white/10 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-white/10"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
