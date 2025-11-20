import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronDown, User, LogOut } from "lucide-react";
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
      { label: "Documentation", page: "SecurityDocs" },
      { label: "Roadmap", page: "Roadmap" },
      { label: "FAQ", page: "FAQ" },
    ],
  },
];

export default function Navbar({ user, onLogin, onLogout }) {
  const [open, setOpen] = useState(null);

  return (
    <nav className="w-full bg-black border-b border-ultraviolet/40 shadow-[0_0_15px_rgba(128,0,255,0.5)] text-gray-200 font-light z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to={createPageUrl("Home")} className="flex items-center gap-3">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png"
            alt="GlyphLock"
            className="h-8 w-auto"
          />
          <span className="text-ultraviolet font-semibold text-xl tracking-wide">
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
                className="flex items-center gap-1 hover:text-cyan-300 transition -mt-2"
              >
                {section.label}
                <ChevronDown size={16} />
              </button>

              {open === section.label && (
                <div
                  className="absolute left-0 top-full bg-black border border-ultraviolet/40 rounded-lg shadow-xl p-3 w-56 z-50"
                >
                  {section.items.map((item) => (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      className="block px-3 py-2 rounded-md hover:bg-ultraviolet/20 hover:text-cyan-300 transition"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link to={createPageUrl("Pricing")}>
            <button className="hover:text-cyan-300 transition">Pricing</button>
          </Link>

          <Link to={createPageUrl("Consultation")}>
            <button className="px-5 py-2 rounded-md bg-black border border-ultraviolet text-cyan-300 font-medium shadow-[0_0_12px_rgba(127,0,255,0.6)] hover:bg-ultraviolet/20 hover:text-white transition">
              Contact
            </button>
          </Link>

          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button className="bg-black border border-ultraviolet/50 text-white hover:bg-ultraviolet/20">
                  <User className="w-4 h-4 mr-2" />
                  {user.full_name?.split(" ")[0] || "User"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border-ultraviolet/40 shadow-[0_0_15px_rgba(127,0,255,0.5)]">
                <DropdownMenuItem asChild className="text-white hover:bg-ultraviolet/20">
                  <Link to={createPageUrl("Dashboard")}>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-ultraviolet/30" />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-red-400 hover:bg-red-500/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={onLogin}
              className="bg-black border border-ultraviolet/50 text-white hover:bg-ultraviolet/20"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}