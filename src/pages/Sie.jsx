import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

export default function Sie() {
  const [scanRun, setScanRun] = useState(null);
  const [navRows, setNavRows] = useState([]);
  const [routeRows, setRouteRows] = useState([]);
  const [sitemapRows, setSitemapRows] = useState([]);
  const [backendRows, setBackendRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLatestScan = async () => {
    const res = await base44.entities.ScanRun.list({ sort: { started_at: -1 }, limit: 1 });
    if (res.data && res.data.length > 0) {
      setScanRun(res.data[0]);
      // Fetch details
      const scanId = res.data[0].scan_id;
      const nav = await base44.entities.NavAuditRow.list({ filter: { scan_run_id: scanId } });
      setNavRows(nav.data);
      const routes = await base44.entities.RouteAuditRow.list({ filter: { scan_run_id: scanId } });
      setRouteRows(routes.data);
      const sitemaps = await base44.entities.SitemapAuditRow.list({ filter: { scan_run_id: scanId } });
      setSitemapRows(sitemaps.data);
      const backends = await base44.entities.BackendAuditRow.list({ filter: { scan_run_id: scanId } });
      setBackendRows(backends.data);
    }
  };

  useEffect(() => {
    fetchLatestScan();
  }, []);

  const runScan = async () => {
    setLoading(true);
    try {
      await base44.functions.invoke("runFullScan");
      await fetchLatestScan();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-slate-950 border-slate-800 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Site Intelligence Engine</CardTitle>
            <p className="text-slate-400">System Integrity & Auditing</p>
          </div>
          <div className="flex gap-4 items-center">
            {scanRun && (
              <div className="text-right">
                <p className="text-sm text-slate-400">Last Scan</p>
                <p className="font-mono">{new Date(scanRun.started_at).toLocaleString()}</p>
              </div>
            )}
            <Button onClick={runScan} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Run Full Scan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatusCard label="Navigation" ok={scanRun?.nav_ok_count} warn={scanRun?.nav_warning_count} crit={scanRun?.nav_critical_count} />
            <StatusCard label="Routes" ok={scanRun?.route_ok_count} warn={scanRun?.route_warning_count} crit={scanRun?.route_critical_count} />
            <StatusCard label="Sitemaps" ok={scanRun?.sitemap_ok_count} warn={scanRun?.sitemap_warning_count} crit={scanRun?.sitemap_critical_count} />
            <StatusCard label="Backend" ok={scanRun?.backend_ok_count} warn={scanRun?.backend_warning_count} crit={scanRun?.backend_critical_count} />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-slate-900 text-slate-400">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="sitemaps">Sitemaps</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">System Status</h3>
                  <div className="flex items-center gap-2">
                    {scanRun?.status === 'success' ? <CheckCircle2 className="text-green-500 h-8 w-8" /> :
                     scanRun?.status === 'warning' ? <AlertTriangle className="text-yellow-500 h-8 w-8" /> :
                     <AlertCircle className="text-red-500 h-8 w-8" />}
                    <span className="text-xl capitalize text-white">{scanRun?.status || 'Unknown'}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="navigation">
              <DataTable 
                columns={['Label', 'Path', 'Visibility', 'Status', 'Severity', 'Action']}
                data={navRows}
                renderRow={(row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-white">{row.label}</TableCell>
                    <TableCell className="font-mono text-slate-300">{row.path}</TableCell>
                    <TableCell><Badge variant="outline">{row.visibility}</Badge></TableCell>
                    <TableCell>{row.http_status}</TableCell>
                    <TableCell><SeverityBadge severity={row.severity} /></TableCell>
                    <TableCell className="text-white">{row.required_action}</TableCell>
                  </TableRow>
                )}
              />
            </TabsContent>

            <TabsContent value="routes">
              <DataTable 
                columns={['Route', 'Component', 'Public', 'Auth', 'Severity', 'Action']}
                data={routeRows}
                renderRow={(row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-white">{row.route_path}</TableCell>
                    <TableCell className="text-slate-300">{row.component_name}</TableCell>
                    <TableCell>{row.is_public ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{row.has_auth_guard ? 'Yes' : 'No'}</TableCell>
                    <TableCell><SeverityBadge severity={row.severity} /></TableCell>
                    <TableCell className="text-white">{row.required_action}</TableCell>
                  </TableRow>
                )}
              />
            </TabsContent>

            <TabsContent value="sitemaps">
              <DataTable 
                columns={['Type', 'Human URL', 'XML URL', 'Exists', 'Severity', 'Action']}
                data={sitemapRows}
                renderRow={(row) => (
                  <TableRow key={row.id}>
                    <TableCell className="capitalize text-white">{row.sitemap_type}</TableCell>
                    <TableCell><a href={row.human_readable_url} className="text-blue-400 hover:underline">{row.human_readable_url}</a></TableCell>
                    <TableCell><a href={row.xml_url} className="text-blue-400 hover:underline">XML</a></TableCell>
                    <TableCell>{row.human_exists && row.xml_exists ? 'Yes' : 'No'}</TableCell>
                    <TableCell><SeverityBadge severity={row.severity} /></TableCell>
                    <TableCell className="text-white">{row.required_action}</TableCell>
                  </TableRow>
                )}
              />
            </TabsContent>

            <TabsContent value="backend">
              <DataTable 
                columns={['Function', 'Endpoint', 'Exists', 'Responds', 'Severity', 'Action']}
                data={backendRows}
                renderRow={(row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-white">{row.function_name}</TableCell>
                    <TableCell className="font-mono text-slate-300">{row.endpoint_path}</TableCell>
                    <TableCell>{row.function_exists ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{row.responds_correctly ? 'Yes' : 'No'}</TableCell>
                    <TableCell><SeverityBadge severity={row.severity} /></TableCell>
                    <TableCell className="text-white">{row.required_action}</TableCell>
                  </TableRow>
                )}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusCard({ label, ok = 0, warn = 0, crit = 0 }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="pt-6">
        <p className="text-sm text-slate-400 mb-2">{label}</p>
        <div className="flex gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-green-500">{ok}</p>
            <p className="text-xs text-slate-500">OK</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-yellow-500">{warn}</p>
            <p className="text-xs text-slate-500">Warn</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-500">{crit}</p>
            <p className="text-xs text-slate-500">Crit</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SeverityBadge({ severity }) {
  const colors = {
    ok: "bg-green-500/10 text-green-500",
    warning: "bg-yellow-500/10 text-yellow-500",
    critical: "bg-red-500/10 text-red-500"
  };
  return <Badge className={colors[severity] || "bg-slate-500/10 text-slate-500"}>{severity}</Badge>;
}

function DataTable({ columns, data, renderRow }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-900">
              {columns.map(c => <TableHead key={c} className="text-slate-400">{c}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-slate-500 h-24">No data available</TableCell>
              </TableRow>
            ) : (
              data.map(renderRow)
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}