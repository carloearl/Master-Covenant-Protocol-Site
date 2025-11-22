import React, { useState, useEffect } from "react";
import { Search, Bell, Settings, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { base44 } from "@/api/base44Client";
import { glyphLockAPI } from "@/components/api/glyphLockAPI";
import NotificationDrawer from "./NotificationDrawer";

export default function TopBar({ user, projectName = "GlyphLock Production" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const data = await glyphLockAPI.notifications.list();
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error("Failed to load notification count:", err);
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <header className="h-16 bg-[#0A0F24]/95 border-b border-[#00E4FF]/20 flex items-center justify-between px-6 backdrop-blur-xl">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search functions, keys, logs..."
            className="pl-10 bg-[#020617] border-[#00E4FF]/20 text-white placeholder:text-white/50 focus:border-[#00E4FF]/50"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Project Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white/70 hover:text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm">{projectName}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#0A0F24] border-[#8C4BFF]/20">
            <DropdownMenuLabel className="text-white/70">Projects</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-white hover:bg-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                GlyphLock Production
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                GlyphLock Staging
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white/70 hover:text-white relative"
          onClick={() => setShowNotifications(true)}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>

        <NotificationDrawer 
          isOpen={showNotifications}
          onClose={() => {
            setShowNotifications(false);
            loadUnreadCount();
          }}
        />

        {/* Settings */}
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
          <Settings className="w-5 h-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white/70 hover:text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#8C4BFF]/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#8C4BFF]" />
                </div>
                <ChevronDown className="w-4 h-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#0A0F24] border-[#8C4BFF]/20 w-56">
            <DropdownMenuLabel className="text-white/70">
              <div className="flex flex-col">
                <span className="text-white">{user?.email}</span>
                <span className="text-xs text-white/50 capitalize">{user?.role || "User"}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-white hover:bg-white/10">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-white/10">
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-white/10">
              Documentation
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-400 hover:bg-red-500/10"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}