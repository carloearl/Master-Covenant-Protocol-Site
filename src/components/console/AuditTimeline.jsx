import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Key, Users, DollarSign, Shield, X } from 'lucide-react';
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
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [activeFilters]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const filters = activeFilters.length > 0 ? { types: activeFilters } : {};
      const data = await glyphLockAPI.logs.listBillingEvents(filters);
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch audit events:', error);
      toast.error('Failed to load audit timeline');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filterType) => {
    setActiveFilters(prev =>
      prev.includes(filterType)
        ? prev.filter(f => f !== filterType)
        : [...prev, filterType]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  const groupByDay = (events) => {
    const grouped = {};
    events.forEach(event => {
      const date = new Date(event.timestamp).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(event);
    });
    return grouped;
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

  const FILTER_OPTIONS = [
    { id: 'api_key', label: 'API Keys', icon: Key },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'role_change', label: 'Roles', icon: Users },
    { id: 'invite', label: 'Invites', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'entitlement', label: 'Entitlements', icon: Shield }
  ];

  const groupedEvents = groupByDay(events);

  return (
    <RoleGate userRole={user?.role} requiredRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">Audit Timeline</h2>
        </div>

        {/* Multi-Filter Bar */}
        <Card className="glass-card border-cyan-500/30">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-white/60 text-sm mr-2">Filter by:</span>
              {FILTER_OPTIONS.map(filterOpt => {
                const Icon = filterOpt.icon;
                const isActive = activeFilters.includes(filterOpt.id);
                return (
                  <Button
                    key={filterOpt.id}
                    onClick={() => toggleFilter(filterOpt.id)}
                    size="sm"
                    variant={isActive ? 'default' : 'outline'}
                    className={isActive
                      ? 'bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90'
                      : 'border-white/10 text-white hover:bg-white/10'
                    }
                  >
                    <Icon className="h-3 w-3 mr-2" />
                    {filterOpt.label}
                  </Button>
                );
              })}
              {activeFilters.length > 0 && (
                <Button
                  onClick={clearFilters}
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grouped Events by Day */}
        {Object.keys(groupedEvents).length === 0 ? (
          <Card className="glass-card border-purple-500/30">
            <CardContent className="py-12 text-center text-white/50">
              No events found
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedEvents).map(([day, dayEvents]) => (
            <Card key={day} className="glass-card border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  {day} ({dayEvents.length} events)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-white/10 pl-6 space-y-6">
                  {dayEvents.map((event, idx) => {
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </RoleGate>
  );
}