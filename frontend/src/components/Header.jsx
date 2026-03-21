import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onGetStarted, onReset, showDashboard }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHome = () => {
    if (showDashboard && onReset) {
      onReset(); // Go back to landing page
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const handleGetStarted = () => {
    setMenuOpen(false);
    if (showDashboard && onReset) {
      onReset(); // Go back to hero/upload
    } else if (onGetStarted) {
      onGetStarted();
    } else {
      scrollTo('upload-form');
    }
  };

  const navLinks = [
    { label: 'Platform',     action: handleHome },
    { label: 'Architecture', action: () => scrollTo('features-section') },
    { label: 'Creators',     action: () => scrollTo('team-section') },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-surface-bg/80 border-b border-surface-border shadow-xl' : 'backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={handleHome}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="bg-gradient-to-br from-brand-blue to-brand-cyan w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(59,130,246,0.4)] transition-transform group-hover:scale-110">
            <Zap size={24} className="text-white fill-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Algo<span className="text-brand-blue">Rangers</span>
          </h2>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-400">
          {navLinks.map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="hover:text-slate-50 transition-colors relative group"
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue group-hover:w-full transition-all duration-300 rounded-full" />
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl glass hover:bg-white/5 transition-colors text-slate-400 hover:text-slate-50"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Get Started */}
          <button
            onClick={handleGetStarted}
            className="hidden md:block bg-gradient-to-br from-brand-cyan to-brand-blue text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:brightness-110 hover:scale-105 transition-all"
          >
            {showDashboard ? 'New Analysis' : 'Get Started'}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 rounded-xl glass text-slate-400 hover:text-slate-50"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-surface-border px-6 py-4 flex flex-col gap-4"
        >
          {navLinks.map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="text-left text-slate-300 font-bold hover:text-slate-50 transition-colors py-1"
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleGetStarted}
            className="w-full bg-gradient-to-br from-brand-cyan to-brand-blue text-white px-5 py-3 rounded-xl font-bold text-sm mt-2"
          >
            {showDashboard ? 'New Analysis' : 'Get Started'}
          </button>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
