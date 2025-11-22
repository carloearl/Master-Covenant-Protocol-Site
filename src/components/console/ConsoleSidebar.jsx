import React from "react";
import { Home, Key, Download, Users, FileText, Zap, Shield, Book, LogOut, DollarSign } from "lucide-react";
import { base44 } from "@/api/base44Client";

const modules = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "sdk", label: "SDK Center", icon: Download },
  { id: "users", label: "User Management", icon: Users },
  { id: "logs", label: "System Logs", icon: FileText },
  { id: "functions", label: "Edge Functions", icon: Zap },
  { id: "security", label: "Security", icon: Shield },
  { id: "api-reference", label: "API Reference", icon: Book },
  { id: "billing", label: "Billing & Payments", icon: DollarSign },
];

export default function ConsoleSidebar({ activeModule, setActiveModule, user }) {
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
            <p className="text-xs text-white/50">Enterprise Console</p>
          </div>
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
        {modules.map((module) => {
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