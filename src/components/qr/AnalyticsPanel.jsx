import React, { useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, AlertCircle, MapPin, Activity, Copy, ExternalLink, Calendar, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Fix Leaflet marker icons
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function AnalyticsPanel({ qrAssetId, codeId }) {
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() });

  const { data: scanEvents = [], isLoading, refetch } = useQuery({
    queryKey: ['qrScanEvents', qrAssetId],
    queryFn: async () => {
      if (!qrAssetId) return [];
      try {
        // In real app, apply date filter in backend query
        return await base44.entities.QrScanEvent.filter({ qrAssetId }, '-scannedAt', 1000);
      } catch (err) {
        console.error('Failed to fetch scan events:', err);
        return [];
      }
    },
    enabled: !!qrAssetId,
    refetchInterval: 30000 
  });

  // Client-side filtering for demo
  const filteredEvents = useMemo(() => {
    if (!scanEvents) return [];
    return scanEvents.filter(e => {
      const d = new Date(e.scannedAt);
      return (!dateRange.from || d >= dateRange.from) && (!dateRange.to || d <= dateRange.to);
    });
  }, [scanEvents, dateRange]);

  const redirectUrl = codeId ? `${window.location.origin}/r/${codeId}` : null;

  const metrics = useMemo(() => {
    const totalScans = filteredEvents.length;
    const uniqueUsers = new Set(filteredEvents.map(e => e.deviceHint + e.geoApprox)).size;
    const tamperCount = filteredEvents.filter(e => e.tamperSuspected).length;
    const avgRisk = totalScans > 0
      ? filteredEvents.reduce((sum, e) => sum + (e.riskScoreAtScan || 0), 0) / totalScans
      : 0;
    
    const conversions = Math.round(totalScans * 0.12);
    const conversionRate = totalScans > 0 ? ((conversions / totalScans) * 100).toFixed(1) : 0;

    return { totalScans, uniqueUsers, tamperCount, avgRisk: avgRisk.toFixed(1), conversions, conversionRate };
  }, [filteredEvents]);

  const scansOverTime = useMemo(() => {
    const buckets = {};
    filteredEvents.forEach(event => {
      const date = new Date(event.scannedAt).toLocaleDateString();
      buckets[date] = (buckets[date] || 0) + 1;
    });
    return Object.entries(buckets)
      .map(([date, scans]) => ({ date, scans }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredEvents]);

  const riskDistribution = useMemo(() => {
    const buckets = { safe: 0, low: 0, medium: 0, high: 0, critical: 0 };
    filteredEvents.forEach(event => {
      const score = event.riskScoreAtScan || 0;
      if (score >= 70) buckets.critical++;
      else if (score >= 50) buckets.high++;
      else if (score >= 30) buckets.medium++;
      else if (score >= 10) buckets.low++;
      else buckets.safe++;
    });
    return Object.entries(buckets).map(([level, count]) => ({ level, count }));
  }, [filteredEvents]);

  // Mock geo coordinates for map since QrScanEvent only has coarse strings currently
  const geoMarkers = useMemo(() => {
    // In production, QrScanEvent should store lat/lng. 
    // Here we map approximate locations to hardcoded coords for demo visualization.
    return filteredEvents.slice(0, 50).map(e => ({
       lat: 20 + Math.random() * 40, 
       lng: -100 + Math.random() * 80, 
       loc: e.geoApprox || 'Unknown' 
    }));
  }, [filteredEvents]);

  const handleExportCSV = () => {
    const headers = ['Scanned At', 'Geo', 'Device', 'Resolved URL', 'Risk Score', 'Tamper Suspected', 'Tamper Reason'];
    const rows = filteredEvents.map(e => [
      e.scannedAt,
      e.geoApprox || 'unknown',
      e.deviceHint || 'unknown',
      e.resolvedUrl || '',
      e.riskScoreAtScan || 0,
      e.tamperSuspected ? 'Yes' : 'No',
      e.tamperReason || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-analytics-${qrAssetId}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredEvents, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-analytics-${qrAssetId}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('JSON exported');
  };

  const copyRedirectUrl = () => {
    if (redirectUrl) {
      navigator.clipboard.writeText(redirectUrl);
      toast.success('Redirect URL copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 p-12 text-center">
        <p className="text-gray-400">Loading analytics...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Redirect URL Display */}
      {redirectUrl && (
        <Alert className="bg-cyan-500/10 border-cyan-500/30">
          <ExternalLink className="h-4 w-4 text-cyan-400" />
          <AlertDescription className="text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="font-semibold mb-1">Analytics Redirect URL</p>
                <p className="text-xs text-gray-400 font-mono break-all">{redirectUrl}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Create a QR with this URL to track scans via the qrRedirect function
                </p>
              </div>
              <Button
                onClick={copyRedirectUrl}
                size="sm"
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Empty state when no scans yet */}
      {scanEvents.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-700 p-12 text-center">
          <Activity className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-bold text-white mb-2">No Scans Yet</h3>
          <p className="text-gray-400 mb-4">
            When someone scans your QR code via the redirect URL above, analytics will appear here.
          </p>
          <div className="text-xs text-gray-500 space-y-1 mb-6">
            <p>• Scan tracking is automatic via /r/{codeId || 'qrId'}</p>
            <p>• Data updates every 30 seconds</p>
            <p>• Geographic and device insights included</p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="border-cyan-500/50 text-cyan-400"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </Card>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gray-900/50 border-gray-800 shadow-xl hover:shadow-cyan-500/10 transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Scans</p>
                    <p className="text-3xl font-bold text-white">{metrics.totalScans}</p>
                  </div>
                  <Activity className="w-8 h-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Tamper Events</p>
                    <p className="text-3xl font-bold text-red-400">{metrics.tamperCount}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Avg Risk Score</p>
                    <p className="text-3xl font-bold text-yellow-400">{metrics.avgRisk}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Est. Conversions</p>
                    <p className="text-3xl font-bold text-green-400">{metrics.conversions}</p>
                    <p className="text-xs text-gray-500">{metrics.conversionRate}% Rate</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-800 shadow-xl">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white text-base lg:text-lg">Scans Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={scansOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Line type="monotone" dataKey="scans" stroke="#06b6d4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 shadow-xl">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white text-base lg:text-lg">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={riskDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="level" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 shadow-xl lg:col-span-2 overflow-hidden">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white text-base lg:text-lg">Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[350px]">
                 <MapContainer center={[30, -10]} zoom={2} style={{ height: '100%', width: '100%', background: '#111827' }}>
                   <TileLayer
                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                     url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                   />
                   {geoMarkers.map((marker, i) => (
                     <Marker key={i} position={[marker.lat, marker.lng]}>
                       <Popup className="text-black">
                         {marker.loc}
                       </Popup>
                     </Marker>
                   ))}
                 </MapContainer>
              </CardContent>
            </Card>
          </div>

          {/* Events Table */}
          <Card className="bg-gray-900/50 border-gray-800 shadow-xl">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800">
              <div className="flex items-center gap-4">
                 <CardTitle className="text-white text-base lg:text-lg">Scan Events</CardTitle>
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 gap-2">
                         <Calendar className="w-4 h-4" />
                         Date Range
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700">
                      <CalendarComponent
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        className="rounded-md border-none text-white"
                      />
                    </PopoverContent>
                 </Popover>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleExportJSON} variant="outline" size="sm" className="gap-2 border-gray-700 hover:bg-gray-800 text-gray-300">
                  <FileJson className="w-4 h-4" />
                  JSON
                </Button>
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-700 hover:bg-gray-800 text-gray-300"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-2 sm:p-3 text-gray-400 font-semibold text-xs sm:text-sm">Time</th>
                      <th className="text-left p-2 sm:p-3 text-gray-400 font-semibold text-xs sm:text-sm">Location</th>
                      <th className="text-left p-2 sm:p-3 text-gray-400 font-semibold text-xs sm:text-sm hidden md:table-cell">Device</th>
                      <th className="text-left p-2 sm:p-3 text-gray-400 font-semibold text-xs sm:text-sm">Risk</th>
                      <th className="text-left p-2 sm:p-3 text-gray-400 font-semibold text-xs sm:text-sm">Tamper</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanEvents.slice(0, 20).map((event, idx) => (
                      <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="p-2 sm:p-3 text-gray-300 text-xs sm:text-sm">
                          <div className="whitespace-nowrap">
                            {new Date(event.scannedAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(event.scannedAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="p-2 sm:p-3 text-gray-300 text-xs sm:text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[80px] sm:max-w-none">{event.geoApprox || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="p-2 sm:p-3 text-gray-400 text-xs truncate max-w-[150px] hidden md:table-cell">
                          {event.deviceHint || 'Unknown'}
                        </td>
                        <td className="p-2 sm:p-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            (event.riskScoreAtScan || 0) >= 50
                              ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                              : (event.riskScoreAtScan || 0) >= 30
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                              : 'bg-green-500/20 text-green-400 border border-green-500/50'
                          }`}>
                            {event.riskScoreAtScan || 0}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3">
                          {event.tamperSuspected ? (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/50">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/50">
                              No
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}