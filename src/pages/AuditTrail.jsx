import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Filter, Shield, AlertTriangle, CheckCircle, FileText } from "lucide-react";

export default function AuditTrail() {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(50);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs', limit],
    queryFn: () => base44.entities.SystemAuditLog.list('-created_date', limit)
  });

  const filteredLogs = logs.filter(log => {
    const matchesType = filterType === 'all' || log.event_type === filterType;
    const matchesSearch = searchTerm === '' || 
      log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor_email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getEventIcon = (type) => {
    if (type.includes('FAILURE') || type.includes('ALERT')) return <AlertTriangle className="w-4 h-4 text-red-400" />;
    if (type.includes('SUCCESS') || type.includes('ENABLED')) return <CheckCircle className="w-4 h-4 text-green-400" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  const uniqueEventTypes = ['all', ...new Set(logs.map(l => l.event_type).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <SEOHead
        title="Audit Trail | GlyphLock Security"
        description="Comprehensive audit logs of system and user activities."
      />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              Audit Trail
            </h1>
            <p className="text-slate-400 mt-1">Detailed log of all system and user activities for compliance and monitoring.</p>
          </div>
          <div className="flex items-center gap-2">
             <Badge variant="outline" className="text-slate-400 border-slate-700">
               {logs.length} Total Events
             </Badge>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-slate-500" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueEventTypes.map(type => (
                      <SelectItem key={type} value={type}>{type === 'all' ? 'All Events' : type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
                  <SelectTrigger className="w-[100px] bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              </div>
            ) : (
              <div className="rounded-md border border-slate-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-400">Timestamp</TableHead>
                      <TableHead className="text-slate-400">Event Type</TableHead>
                      <TableHead className="text-slate-400">Description</TableHead>
                      <TableHead className="text-slate-400">Actor</TableHead>
                      <TableHead className="text-slate-400">Severity</TableHead>
                      <TableHead className="text-slate-400">IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/30">
                          <TableCell className="font-mono text-xs text-slate-500">
                            {new Date(log.created_date).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEventIcon(log.event_type)}
                              <span className="font-medium text-slate-300">{log.event_type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-400 max-w-md truncate">
                            {log.description}
                          </TableCell>
                          <TableCell className="text-slate-400">
                            {log.actor_email}
                          </TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(log.severity)}>
                              {log.severity || 'low'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-slate-500">
                            {log.ip_address || '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                          No audit logs found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}