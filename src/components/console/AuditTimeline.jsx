import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Key, Users, DollarSign, Shield, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import glyphLockAPI from '@/components/api/glyphLockAPI';
import RoleGate from './RoleGate';

const EVENT_ICONS = {
  'api_key': Key,
  'billing': DollarSign,
  'role_change': Users,
  'invite': Users,
  'security': Shield,
  'entitlement': Shield,
  'default': Clock
};

const EVENT_COLORS = {
  'api_key': 'text-cyan-400 bg-cyan-400/20',
  'billing': 'text-green-400 bg-green-400/20',
  'role_change': 'text-purple-400 bg-purple-400/20',
  'invite': 'text-blue-400 bg-blue-400/20',
  'security': 'text-red-400 bg-red-400/20',
  'entitlement': 'text-yellow-400 bg-yellow-400/20',
  'default': 'text-white/40 bg-white/10'
};

export default function AuditTimeline({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const filters = filter !== 'all' ? { type: filter } : {};
      const data = await glyphLockAPI.logs.listBillingEvents(filters);
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch audit events:', error);
      toast.error('Failed to load audit timeline');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Audit Timeline</h2>
        <Skeleton className="h-64 w-full bg-white/5 glass-card" />
      </div>
    );
  }

  return (
    <RoleGate userRole={user?.role} requiredRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">Audit Timeline</h2>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48 glass-card border-white/10 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="api_key">API Keys</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="role_change">Role Changes</SelectItem>
              <SelectItem value="invite">Team Invites</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="entitlement">Entitlements</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="glass-card border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" />
              Event History ({events.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  No events found for selected filter
                </div>
              ) : (
                <div className="relative border-l-2 border-white/10 pl-6 space-y-6">
                  {events.map((event, idx) => {
                    const Icon = EVENT_ICONS[event.type] || EVENT_ICONS.default;
                    const colorClass = EVENT_COLORS[event.type] || EVENT_COLORS.default;

                    return (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-9 w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div className="glass-card border-white/10 p-4 rounded-lg hover:border-purple-500/30 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-white font-semibold">{event.title}</h4>
                              <p className="text-white/60 text-sm">{event.description}</p>
                            </div>
                            <span className="text-xs text-white/40">
                              {formatTimestamp(event.timestamp)}
                            </span>
                          </div>
                          
                          {event.metadata && (
                            <div className="mt-3 text-xs text-white/50">
                              <p>Actor: {event.metadata.actor || 'System'}</p>
                              {event.metadata.details && (
                                <p className="mt-1">Details: {event.metadata.details}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}