import React, { useState } from "react";
import { Home, Key, Download, Users, FileText, Zap, Shield, Book, LogOut, DollarSign, TrendingUp, UsersRound, Clock, Code, Settings2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const coreModules = [
  { id: "dashboard", label: "Dashboard", icon: Home },
];

const developerModules = [
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "sdk", label: "SDK Center", icon: Download },
  { id: "functions", label: "Edge Functions", icon: Zap },
  { id: "api-reference", label: "API Docs", icon: Book },
  { id: "logs", label: "Logs", icon: FileText },
];

const enterpriseModules = [
  { id: "billing", label: "Billing", icon: DollarSign },
  { id: "usage", label: "Usage", icon: TrendingUp },
  { id: "team-roles", label: "Team & Roles", icon: UsersRound },
  { id: "audit-timeline", label: "Audit Timeline", icon: Clock },
  { id: "security", label: "Security", icon: Shield },
];

const adminOnlyModules = [
  { id: "admin-billing", label: "Admin Billing", icon: Settings2 },
];

export default function ConsoleSidebar({ activeModule, setActiveModule, user }) {
  const [mode, setMode] = useState("developer"); // "developer" or "enterprise"
  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <aside className="w-64 bg-[#0A0F24] border-r border-[#8C4BFF]/20 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#8C4BFF]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8C4BFF] to-[#00E4FF] flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">GlyphLock</h1>
            <p className="text-xs text-[#00E4FF]">Command Center</p>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="p-4 border-b border-[#8C4BFF]/20">
        <div className="flex gap-2 p-1 bg-[#020617] rounded-lg">
          <button
            onClick={() => setMode("developer")}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
              mode === "developer"
                ? "bg-[#00E4FF] text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Code className="w-4 h-4 mx-auto mb-1" />
            DEVELOPER
          </button>
          <button
            onClick={() => setMode("enterprise")}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
              mode === "enterprise"
                ? "bg-[#8C4BFF] text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Shield className="w-4 h-4 mx-auto mb-1" />
            ENTERPRISE
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-[#8C4BFF]/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#8C4BFF]/20 flex items-center justify-center">
            <span className="text-sm font-bold text-[#8C4BFF]">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
            <p className="text-xs text-white/50 capitalize">{user?.role || "User"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Core Modules - Always Visible */}
        {coreModules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-2 ${
                isActive
                  ? "bg-gradient-to-r from-[#00E4FF]/20 to-[#8C4BFF]/20 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{module.label}</span>
            </button>
          );
        })}

        <div className="my-3 border-t border-white/10"></div>

        {mode === "developer" ? (
          <>
            <div className="pb-2">
              <p className="text-xs text-[#00E4FF] font-semibold px-4 uppercase tracking-wider">Developer Tools</p>
            </div>
            {developerModules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#00E4FF]/20 text-[#00E4FF] shadow-lg shadow-[#00E4FF]/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{module.label}</span>
                </button>
              );
            })}
          </>
        ) : (
          <>
            <div className="pb-2">
              <p className="text-xs text-[#8C4BFF] font-semibold px-4 uppercase tracking-wider">Enterprise Management</p>
            </div>
            {enterpriseModules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#8C4BFF]/20 text-[#8C4BFF] shadow-lg shadow-[#8C4BFF]/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{module.label}</span>
                </button>
              );
            })}

            {/* Admin Only Modules */}
            {user?.role === 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  <p className="text-xs text-red-400 font-semibold px-4 uppercase tracking-wider">Admin Only</p>
                </div>
                {adminOnlyModules.map((module) => {
                  const Icon = module.icon;
                  const isActive = activeModule === module.id;
                  
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-red-500/20 text-red-400 shadow-lg shadow-red-500/10"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{module.label}</span>
                    </button>
                  );
                })}
              </>
            )}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#8C4BFF]/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}