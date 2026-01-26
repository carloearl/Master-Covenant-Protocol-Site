import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X, Info, Phone, FileText, Book, Shield, Users, LogIn, LogOut, User, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileSlideMenu({ isOpen, onClose, user, onLogin, onLogout }) {
    const isAdmin = user?.role === 'admin';
  
  const menuLinks = [
    { label: 'About', icon: Info, page: 'About' },
    { label: 'Contact', icon: Phone, page: 'Contact' },
    { label: 'Master Covenant', icon: Shield, page: 'MasterCovenant' },
    { label: 'NUPS POS', icon: FileText, page: 'NUPS' },
    { label: 'Case Studies', icon: Book, page: 'CaseStudies' },
    { label: 'Dream Team', icon: Users, page: 'DreamTeam' },
    ...(isAdmin ? [{ label: 'SIE Admin', icon: Shield, page: 'Sie' }] : [])
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] md:hidden"
            onClick={onClose}
          />
          
          {/* Slide Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-slate-950/98 backdrop-blur-xl border-l-2 border-purple-500/40 z-[9999] md:hidden overflow-y-auto shadow-[-8px_0_40px_rgba(168,85,247,0.3)]"
            style={{ touchAction: 'pan-y' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-purple-500/30">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Menu
              </h2>
              <button
                onClick={onClose}
                className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* User Section */}
            <div className="p-6 border-b border-purple-500/20">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{user.full_name || user.email}</p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </div>
                    </div>
                    <Link to={createPageUrl("CommandCenter")} onClick={onClose}>
                    <button className="w-full min-h-[56px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/40 transition-all font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-3">
                      <Terminal className="w-5 h-5" />
                      Command Center
                    </button>
                    </Link>
                    <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full min-h-[56px] flex items-center justify-center gap-2 rounded-xl bg-red-500/20 border-2 border-red-500/50 text-red-300 hover:bg-red-500/30 transition-all font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onLogin();
                    onClose();
                  }}
                  className="w-full min-h-[56px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-500 hover:to-purple-500 transition-all font-semibold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </button>
              )}
            </div>
            
            {/* Menu Links */}
            <div className="p-5 space-y-3">
              {menuLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={onClose}
                    className="flex items-center gap-5 min-h-[68px] px-6 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-800/30 border-2 border-slate-700/60 text-white active:bg-gradient-to-r active:from-purple-900/40 active:to-cyan-900/30 active:border-purple-500/70 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <Icon className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                    <span className="font-semibold text-lg">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}