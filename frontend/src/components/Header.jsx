import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="container mx-auto px-6 py-6 sticky top-0 z-50 backdrop-blur-md flex justify-between items-center"
    >
      <div className="flex items-center gap-2.5 group cursor-pointer">
        <div className="bg-gradient-to-br from-brand-blue to-brand-cyan w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(59,130,246,0.4)] transition-transform group-hover:scale-110">
          <Zap size={24} className="text-white fill-white" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">
          Algo<span className="text-brand-blue">Rangers</span>
        </h2>
      </div>

      <nav className="hidden md:flex items-center gap-8 font-medium text-slate-400">
        <a href="#" className="hover:text-slate-50 transition-colors">Home</a>
        <a href="#" className="hover:text-slate-50 transition-colors">Features</a>
        <a href="#" className="hover:text-slate-50 transition-colors">Team</a>
      </nav>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl glass hover:bg-white/5 transition-colors text-slate-400 hover:text-slate-50"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="bg-gradient-to-br from-brand-cyan to-brand-blue text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:brightness-110 hover:scale-105 transition-all">
          Get Started
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
