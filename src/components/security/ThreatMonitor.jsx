import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Search, Filter, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SeverityBadge from "@/components/shared/SeverityBadge";
import { getStatusColor } from "@/components/utils/securityUtils";

export default function ThreatMonitor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const { data: threats = [], isLoading, refetch } = useQuery({
    queryKey: ['threats'],
    queryFn: () => base44.entities.HotzoneThreat.list('-created_date', 50),
    refetchInterval: 10000
  });

  const filteredThreats = threats.filter(threat => {
    const matchesSearch = !searchTerm || 
      threat.hotspot_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.threat_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || threat.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Live Threat Feed
            </CardTitle>
            <Button
              onClick={() => refetch()}
              size="sm"
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search threats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading threats...</div>
            ) : filteredThreats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No threats found</div>
            ) : (
              filteredThreats.map((threat) => (
                <Card key={threat.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <div>
                          <h3 className="font-semibold text-white">{threat.hotspot_name}</h3>
                          <p className="text-sm text-gray-400">{threat.threat_type}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <SeverityBadge severity={threat.severity} />
                        <Badge className={getStatusColor(threat.status)}>
                          {threat.status}
                        </Badge>
                      </div>
                    </div>
                    {threat.description && (
                      <p className="text-sm text-gray-300 mb-2">{threat.description}</p>
                    )}
                    <div className="text-xs text-gray-500">
                      Priority: {threat.priority || 5}/10 • {new Date(threat.created_date).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}