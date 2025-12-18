import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronDown, User, LogOut, Terminal, Menu, X, Sparkles, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { NAV_SECTIONS } from "@/components/NavigationConfig";

const NAV = NAV_SECTIONS;

// Magnetic button effect
function MagneticButton({ children, className, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated nav item with stagger
const NavItem = ({ section, isOpen, onToggle, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
      onMouseEnter={() => { setIsHovered(true); onToggle(section.label); }}
      onMouseLeave={() => { setIsHovered(false); onToggle(null); }}
    >
      <button
        className="relative flex items-center gap-1.5 text-gray-300 hover:text-white transition-all duration-300 py-3 px-4 text-sm font-semibold uppercase tracking-wider group"
      >
        {/* Animated background pill */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-violet-500/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        
        {/* Glowing dot indicator */}
        <motion.span
          className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
          style={{ boxShadow: '0 0 10px #00E4FF, 0 0 20px #00E4FF' }}
        />
        
        <span className="relative z-10">{section.label}</span>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <ChevronDown size={14} className={isOpen ? 'text-cyan-400' : ''} />
        </motion.div>
      </button>

      {/* Mega dropdown with blur backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(5px)" }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-80"
            style={{ zIndex: 10001 }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              {/* Content container - Purple/Blue glass */}
              <div className="relative bg-gradient-to-br from-blue-900/55 via-indigo-900/60 to-violet-900/55 backdrop-blur-2xl backdrop-saturate-150 border-2 border-indigo-400/35 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.5),0_0_80px_rgba(139,92,246,0.3),inset_0_1px_0_rgba(255,255,255,0.18)] overflow-hidden">
                {/* Top glow bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 shadow-[0_0_12px_rgba(59,130,246,0.9)]"></div>

                {/* Black glassmorphism underlay */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

                {/* Grid pattern - purple/blue */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `
                    linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}></div>

                {/* Ambient glow */}
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/25 via-indigo-500/20 to-violet-600/25 blur-xl -z-10"></div>

                <div className="relative p-2">
                  {section.items.map((item, idx) => (
                    <motion.div
                      key={item.page}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3, ease: "easeOut" }}
                    >
                      <Link
                        to={createPageUrl(item.page)}
                        className="group/item relative flex items-center justify-between px-4 py-3.5 rounded-lg text-violet-200 hover:text-white transition-all duration-300"
                      >
                        {/* Hover background */}
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/15 via-indigo-500/25 to-violet-600/20"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />

                        {/* Hover border */}
                        <div className="absolute inset-0 border border-blue-400/0 group-hover/item:border-blue-400/50 rounded-lg transition-all"></div>

                        {/* Left accent bar */}
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-blue-500 via-indigo-500 to-violet-600 rounded-r-full"
                          whileHover={{ height: "60%" }}
                          transition={{ duration: 0.2 }}
                          style={{ boxShadow: '0 0 15px rgba(59,130,246,0.9)' }}
                        />

                        <span className="relative z-10 font-semibold text-sm group-hover/item:translate-x-1 transition-transform duration-200">
                          {item.label}
                        </span>
                        
                        <motion.svg
                          className="w-4 h-4 text-indigo-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          initial={{ x: -5, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Navbar({ user, onLogin, onLogout }) {
  const [openSection, setOpenSection] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();
  const navbarY = useTransform(scrollY, [0, 100], [0, 0]);
  const navbarOpacity = useTransform(scrollY, [0, 50], [1, 0.98]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 20);
      
      // Hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`w-full text-white sticky top-0 transition-all duration-500 ${
        scrolled 
          ? 'bg-gradient-to-r from-blue-900/40 via-indigo-900/50 to-violet-900/40 backdrop-blur-2xl shadow-[0_4px_60px_rgba(59,130,246,0.3)]' 
          : 'bg-gradient-to-r from-blue-900/25 via-indigo-900/30 to-violet-900/25 backdrop-blur-xl'
      }`}
      style={{ 
        zIndex: 10000, 
        pointerEvents: 'auto',
        borderBottom: scrolled ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(99,102,241,0.2)'
      }}
    >
      {/* Animated top line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,228,255,0.5) 20%, rgba(139,92,246,0.5) 50%, rgba(0,228,255,0.5) 80%, transparent)'
        }}
        animate={{
          opacity: scrolled ? 0.8 : 0.4
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-3 flex items-center justify-between">
        {/* Logo with hover effects */}
        <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
          <MagneticButton>
            <div className="relative">
              {/* Animated glow ring */}
              <motion.div
                className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 opacity-0 blur-lg group-hover:opacity-60"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png"
                  alt="GlyphLock"
                  className="h-10 w-auto relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </MagneticButton>
          
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none">
              <span className="text-white">GLYPH</span>
              <span className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text">LOCK</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-cyan-400/70 font-medium">Security</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV && NAV.map((section, idx) => (
            <NavItem
              key={section.label}
              section={section}
              index={idx}
              isOpen={openSection === section.label}
              onToggle={setOpenSection}
            />
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* CTA Button with futuristic design */}
          <Link to={createPageUrl("Consultation")}>
            <MagneticButton>
              <motion.button
                className="group relative px-6 py-2.5 rounded-full overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-full p-[1px]"
                  style={{
                    background: 'linear-gradient(90deg, #00E4FF, #3B82F6, #8B5CF6, #00E4FF)',
                    backgroundSize: '300% 100%'
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-[1px] rounded-full bg-slate-950/90 backdrop-blur-sm" />
                </motion.div>
                
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/0 via-blue-500/20 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <span className="relative z-10 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-300 group-hover:text-white transition-colors">
                  <Zap size={14} className="group-hover:animate-pulse" />
                  Get Started
                </span>
              </motion.button>
            </MagneticButton>
          </Link>

          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all backdrop-blur-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                    {user.full_name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-300 max-w-[80px] truncate">{user.full_name?.split(" ")[0]}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_0_50px_rgba(0,228,255,0.2)] rounded-xl p-2 mt-2 w-60">
                <div className="px-3 py-2.5 mb-2 border-b border-white/10">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                </div>
                <DropdownMenuItem asChild className="text-gray-300 focus:bg-cyan-500/10 focus:text-white rounded-lg cursor-pointer mb-1">
                  <Link to={createPageUrl("CommandCenter")} className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    Command Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-gray-300 focus:bg-blue-500/10 focus:text-white rounded-lg cursor-pointer mb-1">
                  <Link to={createPageUrl("CommandCenter") + "?tab=settings"} className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10 my-1" />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-red-400 focus:bg-red-500/10 focus:text-red-300 rounded-lg cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <motion.button
              onClick={onLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-gray-300 hover:text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              Sign In
            </motion.button>
          )}
        </div>

        {/* Mobile Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} className="text-cyan-400" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu with staggered animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:hidden border-t border-white/10 bg-slate-950/98 backdrop-blur-2xl overflow-hidden"
          >
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {NAV && NAV.map((section, sectionIdx) => (
                <motion.div
                  key={section.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sectionIdx * 0.1 }}
                  className="space-y-3"
                >
                  <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 8px #00E4FF' }} />
                    {section.label}
                  </h3>
                  <div className="grid grid-cols-1 gap-1 pl-4 border-l border-cyan-500/20">
                    {section.items && section.items.map((item, itemIdx) => (
                      <motion.div
                        key={item.page}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: sectionIdx * 0.1 + itemIdx * 0.05 }}
                      >
                        <Link
                          to={createPageUrl(item.page)}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-gray-300 hover:text-white text-sm py-3 px-3 block rounded-lg hover:bg-white/5 transition-all min-h-[48px] flex items-center"
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6 border-t border-white/10 space-y-3"
              >
                {user ? (
                  <>
                    <Link to={createPageUrl("CommandCenter")} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/30 text-white">
                        <Terminal className="w-4 h-4 mr-2" />
                        Command Center
                      </Button>
                    </Link>
                    <Button onClick={onLogout} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={onLogin} variant="ghost" className="text-white hover:bg-white/10 border border-white/10">
                      Sign In
                    </Button>
                    <Link to={createPageUrl("Consultation")} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white border-none">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}