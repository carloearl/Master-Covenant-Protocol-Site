import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronDown, User, LogOut, Terminal } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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

  return (
    <nav className="w-full bg-black/95 border-b border-royal-blue/60 shadow-[0_2px_20px_rgba(65,105,225,0.4)] text-white z-50 sticky top-0 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png"
            alt="GlyphLock"
            className="h-8 w-auto"
          />
          <span className="text-transparent bg-gradient-to-r from-royal-blue to-cyan bg-clip-text font-bold text-xl tracking-tight">
            GlyphLock
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {NAV.map((section) => (
            <div 
              key={section.label} 
              className="relative pt-2"
              onMouseEnter={() => setOpen(section.label)}
              onMouseLeave={() => setOpen(null)}
            >
              <button
                className="flex items-center gap-1 text-gray-300 hover:text-cyan transition-colors -mt-2 text-sm font-medium"
              >
                {section.label}
                <ChevronDown size={14} />
              </button>

              {open === section.label && (
                <div
                  className="absolute left-0 top-full bg-black/95 border border-royal-blue/40 rounded-lg shadow-[0_4px_20px_rgba(65,105,225,0.5)] p-2 w-56 z-50 backdrop-blur-xl"
                >
                  {section.items.map((item) => (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      className="block px-3 py-2 rounded-md hover:bg-royal-blue/20 hover:text-cyan transition-colors text-gray-200 text-sm"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link to={createPageUrl("Pricing")}>
            <button className="text-gray-300 hover:text-cyan transition-colors text-sm font-medium">Pricing</button>
          </Link>

          <Link to={createPageUrl("Consultation")}>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-royal-blue to-cyan text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Contact
            </button>
          </Link>

          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button className="bg-royal-blue/20 border border-royal-blue/50 text-white hover:bg-royal-blue/30 text-sm">
                  <User className="w-4 h-4 mr-1" />
                  {user.full_name?.split(" ")[0] || "User"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/95 border border-royal-blue/40 shadow-[0_4px_20px_rgba(65,105,225,0.5)] backdrop-blur-xl">
                <DropdownMenuItem asChild className="text-gray-200 hover:bg-royal-blue/20 hover:text-cyan text-sm">
                  <Link to={createPageUrl("Dashboard")}>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-gray-200 hover:bg-royal-blue/20 hover:text-cyan text-sm">
                  <Link to={createPageUrl("DeveloperConsole")}>
                    <Terminal className="w-4 h-4 mr-2" />
                    Dev Console
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-royal-blue/30" />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-red-400 hover:bg-red-500/20 text-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={onLogin}
              className="bg-royal-blue/20 border border-royal-blue/50 text-white hover:bg-royal-blue/30 text-sm"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}