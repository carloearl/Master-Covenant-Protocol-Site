import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronDown, User, LogOut, Terminal, Menu, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_SECTIONS } from "@/components/NavigationConfig";

// Use shared navigation config
const NAV = NAV_SECTIONS;

export default function Navbar({ user, onLogin, onLogout }) {
  const [open, setOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-black/80 border-b border-[#00E4FF]/20 shadow-[0_2px_20px_rgba(0,228,255,0.1)] text-white z-50 sticky top-0 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo Area */}
        <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png"
              alt="GlyphLock"
              className="h-10 w-auto relative z-10"
            />
          </div>
          <span className="text-2xl font-black tracking-tighter font-space">
            <span className="text-white">GLYPH</span>
            <span className="text-transparent bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] bg-clip-text">LOCK</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV.map((section) => (
            <div 
              key={section.label} 
              className="relative group/nav"
              onMouseEnter={() => setOpen(section.label)}
              onMouseLeave={() => setOpen(null)}
            >
              <button
                className="relative flex items-center gap-1.5 text-gray-300 hover:text-[#00E4FF] transition-all duration-200 py-2 text-sm font-bold uppercase tracking-wide group/btn"
              >
                {section.label}
                <ChevronDown size={12} className={`transition-all duration-200 ${open === section.label ? 'rotate-180 text-[#00E4FF]' : 'group-hover/btn:translate-y-0.5'}`} />
                
                {/* Underline effect */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] group-hover/btn:w-full transition-all duration-300 shadow-[0_0_8px_rgba(0,228,255,0.6)]"></span>
              </button>

              <AnimatePresence>
                {open === section.label && (
                  <motion.div
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   transition={{ duration: 0.15, ease: "easeOut" }}
                   className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-72 z-50"
                  >
                   <div className="relative bg-[#0A0F24]/85 border border-[#00E4FF]/40 rounded-2xl shadow-[0_0_40px_rgba(0,228,255,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl overflow-hidden">
                     {/* Top glow bar */}
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E4FF] to-[#8C4BFF]"></div>

                     {/* Subtle grid pattern */}
                     <div className="absolute inset-0 opacity-5" style={{
                       backgroundImage: `
                         linear-gradient(rgba(0,228,255,0.3) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0,228,255,0.3) 1px, transparent 1px)
                       `,
                       backgroundSize: '20px 20px'
                     }}></div>

                     {/* Ambient glow */}
                     <div className="absolute -inset-1 bg-gradient-to-br from-[#00E4FF]/10 via-transparent to-[#8C4BFF]/10 blur-xl -z-10"></div>

                     <div className="relative p-2">
                       {section.items.map((item, idx) => (
                         <motion.div
                           key={item.page}
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: idx * 0.05 }}
                         >
                           <Link
                             to={createPageUrl(item.page)}
                             className="group/item relative block px-4 py-3.5 rounded-lg text-gray-300 hover:text-white transition-all duration-200 overflow-hidden"
                           >
                             {/* Hover background */}
                             <div className="absolute inset-0 bg-gradient-to-r from-[#00E4FF]/0 via-[#00E4FF]/5 to-[#8C4BFF]/10 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>

                             {/* Hover border */}
                             <div className="absolute inset-0 border border-[#00E4FF]/0 group-hover/item:border-[#00E4FF]/30 rounded-lg transition-all"></div>

                             {/* Content */}
                             <div className="relative flex items-center justify-between">
                               <span className="font-semibold text-sm group-hover/item:translate-x-1 transition-transform duration-200">
                                 {item.label}
                               </span>
                               <svg className="w-4 h-4 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all text-[#00E4FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                               </svg>
                             </div>

                             {/* Glow effect on hover */}
                             <div className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#00E4FF] to-[#8C4BFF] rounded-r-full shadow-[0_0_10px_rgba(0,228,255,0.5)]"></div>
                             </div>
                           </Link>
                         </motion.div>
                       ))}
                     </div>
                   </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to={createPageUrl("Pricing")}>
            <button className="text-gray-300 hover:text-[#00E4FF] transition-colors text-sm font-bold uppercase tracking-wide">Pricing</button>
          </Link>

          <Link to={createPageUrl("Consultation")}>
            <button className="group relative px-6 py-2.5 rounded-full bg-transparent overflow-hidden transition-all hover:scale-105">
              <div className="absolute inset-0 border border-[#00E4FF] rounded-full"></div>
              <div className="absolute inset-0 bg-[#00E4FF]/10 group-hover:bg-[#00E4FF]/20 transition-all"></div>
              <span className="relative text-[#00E4FF] text-sm font-bold uppercase tracking-wide group-hover:text-white transition-colors">
                Get Started
              </span>
            </button>
          </Link>

          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#0A0F24] border border-[#8C4BFF]/50 text-white hover:bg-[#8C4BFF]/20 hover:border-[#8C4BFF] transition-all text-sm font-medium px-4 py-2 h-auto gap-2 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00E4FF] to-[#8C4BFF] flex items-center justify-center text-[10px] font-bold text-black">
                    {user.full_name?.charAt(0) || "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{user.full_name?.split(" ")[0]}</span>
                  <ChevronDown size={12} className="text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0A0F24]/95 border border-[#8C4BFF]/30 shadow-[0_0_30px_rgba(140,75,255,0.2)] backdrop-blur-2xl rounded-xl p-1 mt-2 w-56">
                <div className="px-2 py-2 mb-2 border-b border-white/10">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-bold text-white truncate">{user.email}</p>
                </div>
                <DropdownMenuItem asChild className="text-gray-300 focus:bg-[#8C4BFF]/20 focus:text-white rounded-lg cursor-pointer mb-1">
                  <Link to={createPageUrl("Dashboard")}>
                    <User className="w-4 h-4 mr-2 text-[#00E4FF]" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-gray-300 focus:bg-[#8C4BFF]/20 focus:text-white rounded-lg cursor-pointer mb-1">
                  <Link to={createPageUrl("CommandCenter")}>
                    <Terminal className="w-4 h-4 mr-2 text-[#8C4BFF]" />
                    Command Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10 my-1" />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-red-400 focus:bg-red-500/10 focus:text-red-300 rounded-lg cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={onLogin}
              className="text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-bold uppercase tracking-wide border-none shadow-none"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white hover:text-[#00E4FF]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-[#020617] overflow-hidden"
          >
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-3">
                <h3 className="text-[#00E4FF] text-xs font-bold uppercase tracking-widest">Featured</h3>
                <div className="grid grid-cols-1 gap-2 pl-4 border-l border-white/10">
                  <Link
                    to={createPageUrl("QRGenerator")}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white text-sm py-1 block"
                  >
                    QR Studio
                  </Link>
                </div>
              </div>
              {NAV.map((section) => (
                <div key={section.label} className="space-y-3">
                  <h3 className="text-[#00E4FF] text-xs font-bold uppercase tracking-widest">{section.label}</h3>
                  <div className="grid grid-cols-1 gap-2 pl-4 border-l border-white/10">
                    {section.items.map((item) => (
                      <Link
                        key={item.page}
                        to={createPageUrl(item.page)}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-400 hover:text-white text-sm py-1 block"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                <Link to={createPageUrl("Pricing")} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white">Pricing</Button>
                </Link>
                {user ? (
                  <>
                    <Link to={createPageUrl("Dashboard")} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#00E4FF]/10 text-[#00E4FF] border border-[#00E4FF]/30">Dashboard</Button>
                    </Link>
                    <Button onClick={onLogout} variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={onLogin} variant="ghost" className="text-white hover:bg-white/10">Sign In</Button>
                    <Link to={createPageUrl("Consultation")} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] text-white border-none">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}