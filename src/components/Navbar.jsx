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

const NAV = [
  {
    label: "Company",
    items: [
      { label: "About", page: "About" },
      { label: "Dream Team", page: "DreamTeam" },
      { label: "Partners", page: "Partners" },
      { label: "Master Covenant", page: "MasterCovenant" },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "QR Code Generator", page: "QRGenerator" },
      { label: "Blockchain Verification", page: "Blockchain" },
      { label: "Interactive Image Studio", page: "InteractiveImageStudio" },
      { label: "Steganography", page: "Steganography" },
      { label: "Hotzone Security Mapper", page: "HotzoneMapper" },
      { label: "NUPS POS System", page: "NUPSLogin" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { label: "GlyphBot Assistant", page: "GlyphBot" },
      { label: "Content Generator", page: "ContentGenerator" },
      { label: "Image Generator", page: "ImageGenerator" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Developer Console", page: "DeveloperConsole" },
      { label: "Documentation", page: "SecurityDocs" },
      { label: "Roadmap", page: "Roadmap" },
      { label: "FAQ", page: "FAQ" },
    ],
  },
];

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
                className="flex items-center gap-1.5 text-gray-300 hover:text-[#00E4FF] transition-colors py-2 text-sm font-bold uppercase tracking-wide"
              >
                {section.label}
                <ChevronDown size={12} className={`transition-transform duration-200 ${open === section.label ? 'rotate-180 text-[#00E4FF]' : ''}`} />
              </button>

              <AnimatePresence>
                {open === section.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-64 z-50"
                  >
                    <div className="bg-[#0A0F24]/95 border border-[#00E4FF]/30 rounded-xl shadow-[0_0_30px_rgba(0,228,255,0.15)] p-2 backdrop-blur-2xl overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF]"></div>
                      {section.items.map((item) => (
                        <Link
                          key={item.page}
                          to={createPageUrl(item.page)}
                          className="block px-4 py-3 rounded-lg hover:bg-white/5 hover:text-[#00E4FF] transition-all text-gray-300 text-sm font-medium group/item"
                        >
                          <span className="group-hover/item:translate-x-1 transition-transform inline-block">
                            {item.label}
                          </span>
                        </Link>
                      ))}
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
                  <Link to={createPageUrl("DeveloperConsole")}>
                    <Terminal className="w-4 h-4 mr-2 text-[#8C4BFF]" />
                    Dev Console
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