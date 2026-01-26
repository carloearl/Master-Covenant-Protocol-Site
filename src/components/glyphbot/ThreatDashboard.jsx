import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle, TrendingUp, BarChart3, Shield, Settings,
  Loader2, RefreshCw, Filter, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function ThreatDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showThresholdEditor, setShowThresholdEditor] = useState(false);

  useEffect(() => {
    loadDashboard();
    // Refresh every 5 minutes
    const interval = setInterval(loadDashboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await base44.functions.invoke('securityAlertManager', {
        action: 'get_dashboard_data'
      });
      setData(response.data);
    } catch (e) {
      console.error('[Dashboard] Load failed:', e);
      toast.error('Failed to load threat dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-3" />
        Loading threat intelligence...
      </div>
    );
  }

  const stats = data?.stats || {};
  const alerts = data?.alerts || [];
  const trend = data?.trend || {};

  const filteredAlerts =
    filterSeverity === 'all' ? alerts : alerts.filter(a => a.severity === filterSeverity);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Threat Intelligence</h2>
            <p className="text-xs text-slate-400">Real-time security alerts & vulnerabilities</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={loadDashboard}
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:border-cyan-500"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setShowThresholdEditor(!showThresholdEditor)}
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:border-cyan-500"
          >
            <Settings className="w-4 h-4 mr-1" />
            Thresholds
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Alerts"
          value={stats.totalAlerts}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="text-cyan-400"
          bgColor="bg-cyan-500/20"
        />
        <StatCard
          title="Critical"
          value={stats.criticalCount}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="text-red-400"
          bgColor="bg-red-500/20"
          highlight={stats.criticalCount > 0}
        />
        <StatCard
          title="High Priority"
          value={stats.highCount}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-orange-400"
          bgColor="bg-orange-500/20"
        />
        <StatCard
          title="Unresolved"
          value={stats.unresolvedAlerts}
          icon={<BarChart3 className="w-5 h-5" />}
          color="text-yellow-400"
          bgColor="bg-yellow-500/20"
        />
      </div>

      {/* Trend Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">7-Day Trend</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Alerts</span>
              <span className="text-white font-semibold">{trend.total || 0}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${Math.min((trend.total || 0) / 10 * 100, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-400">Critical</span>
              <span className={`font-semibold ${trend.critical > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {trend.critical || 0}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{ width: `${Math.min((trend.critical || 0) / 5 * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Active Thresholds</h3>
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.activeThresholds || 0}</div>
              <p className="text-xs text-slate-400 mt-1">thresholds configured</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Recent Alerts ({filteredAlerts.length})
          </h3>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="text-xs bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High & Critical</option>
              <option value="medium">Medium & Up</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No alerts to display
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertRow key={alert.id} alert={alert} />
            ))
          )}
        </div>
      </div>

      {/* Threshold Editor */}
      {showThresholdEditor && (
        <ThresholdEditor
          onClose={() => setShowThresholdEditor(false)}
          onSave={() => {
            loadDashboard();
            setShowThresholdEditor(false);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color, bgColor, highlight }) {
  return (
    <div className={`${bgColor} border ${highlight ? 'border-red-500/70' : 'border-slate-700'} rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">{title}</div>
          <div className={`text-3xl font-bold ${color} mt-2`}>{value}</div>
        </div>
        <div className={color}>{icon}</div>
      </div>
    </div>
  );
}

function AlertRow({ alert }) {
  const severityColors = {
    critical: 'text-red-400 bg-red-500/20 border-red-500/50',
    high: 'text-orange-400 bg-orange-500/20 border-orange-500/50',
    medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50',
    low: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50'
  };

  const statusIcons = {
    new: '🔴',
    acknowledged: '🟡',
    mitigating: '🔵',
    resolved: '✅'
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{statusIcons[alert.status]}</span>
            <h4 className="font-semibold text-white text-sm">{alert.title}</h4>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2">{alert.description}</p>
        </div>
        <span className={`text-[10px] uppercase font-semibold px-2 py-1 rounded border whitespace-nowrap ml-2 ${severityColors[alert.severity]}`}>
          {alert.severity}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700">
        <span>{alert.source}</span>
        <span>{new Date(alert.created_date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

function ThresholdEditor({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState([]);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || severity.length === 0) {
      toast.error('Fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      await base44.functions.invoke('securityAlertManager', {
        action: 'set_threshold',
        alert: {
          name,
          condition: {
            severity,
            source: [],
            keywords: []
          },
          actions: {
            notifyEmails: notifyEmail ? [notifyEmail] : []
          }
        }
      });
      toast.success('Threshold created');
      onSave();
    } catch (e) {
      toast.error('Failed to create threshold');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-purple-500/30 rounded-xl max-w-md w-full p-6">
        <h2 className="text-lg font-bold text-white mb-4">Create Alert Threshold</h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 uppercase">Threshold Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Critical CVEs"
              className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Alert Severity</label>
            <div className="flex gap-2 mt-2">
              {['critical', 'high', 'medium', 'low'].map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() =>
                    setSeverity(severity.includes(sev) ? severity.filter(s => s !== sev) : [...severity, sev])
                  }
                  className={`px-3 py-1 rounded text-xs font-semibold border capitalize ${
                    severity.includes(sev)
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Notify Email</label>
            <input
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1 border-slate-700">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30"
            >
              {submitting ? 'Creating...' : 'Create Threshold'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}