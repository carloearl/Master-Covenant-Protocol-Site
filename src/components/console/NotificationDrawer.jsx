import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { glyphLockAPI } from "@/components/api/glyphLockAPI";
import { useNavigate } from "react-router-dom";

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await glyphLockAPI.notifications.list();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (notification.link) {
      // Navigate to the linked module
      const tab = notification.link.split('=')[1];
      if (tab) {
        navigate(`/command-center?tab=${tab}`);
      }
    }
    // Mark as read
    await glyphLockAPI.notifications.markRead(notification.id);
    onClose();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'billing': return <DollarSign className="w-5 h-5 text-green-400" />;
      case 'security': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-[#0A0F24] border-l border-[#8C4BFF]/20 z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#8C4BFF]/20 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Notifications</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-[#8C4BFF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400/50 mb-4" />
              <p className="text-white/50">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full p-4 rounded-lg bg-[#020617] border border-[#8C4BFF]/20 hover:border-[#8C4BFF]/50 transition-all text-left"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-xs text-white/60 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-white/40">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-[#00E4FF] flex-shrink-0 mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}