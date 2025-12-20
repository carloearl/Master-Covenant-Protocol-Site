import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Play, CheckCircle2, AlertCircle, Shield, Activity, Search, Layout, Database, Lock, AlertTriangle, Eye, FileText } from "lucide-react";
import RoyalLoader from "@/components/shared/RoyalLoader";

export default function SiteAudit() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, phase1, phase2, phase3
  
  // Phase 1 State
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [lastScan, setLastScan] = useState(null);

  // Phase 2 State
  const [scanning2, setScanning2] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [lastScore, setLastScore] = useState(null);

  // Phase 3 State
  const [scanning3, setScanning3] = useState(false);
  const [securityResult, setSecurityResult] = useState(null);
  const [lastSecurity, setLastSecurity] = useState(null);

  // --- PHASE 1 ACTIONS ---
  const runPhase1 = async () => {
    setScanning(true);
    try {
      const response = await base44.functions.invoke("siePhase1Scan", {});
      setScanResult(response.data);
      setLastScan(new Date());
      setActiveTab('phase1');
    } catch (error) {
      console.error("Scan failed:", error);
    } finally {
      setScanning(false);
    }
  };

  const handleExportPhase1 = () => {
    if (!scanResult) return;
    downloadJSON(scanResult, `SIE_Phase1_Observation_${new Date().toISOString()}.json`);
  };

  // --- PHASE 2 ACTIONS ---
  const runPhase2 = async () => {
    if (!scanResult) return;
    setScanning2(true);
    try {
      const response = await base44.functions.invoke("siePhase2Score", {});
      setScoreResult(response.data);
      setLastScore(new Date());
      setActiveTab('phase2');
    } catch (error) {
      console.error("Score failed:", error);
    } finally {
      setScanning2(false);
    }
  };

  const handleExportPhase2 = () => {
    if (!scoreResult) return;
    downloadJSON(scoreResult, `SIE_Phase2_Scoring_${new Date().toISOString()}.json`);
  };

  // --- PHASE 3 ACTIONS ---
  const runPhase3 = async () => {
    if (!scanResult) return;
    setScanning3(true);
    try {
      const response = await base44.functions.invoke("siePhase3Analysis", {
        scanId: scanResult.meta.scan_id || scanResult.meta.id || "latest", // Fallback handling
        targetUrl: window.location.origin
      });
      setSecurityResult(response.data);
      setLastSecurity(new Date());
      setActiveTab('phase3');
    } catch (error) {
      console.error("Security analysis failed:", error);
    } finally {
      setScanning3(false);
    }
  };

  const handleExportPhase3 = () => {
    if (!securityResult) return;
    downloadJSON(securityResult, `SIE_Phase3_Security_${new Date().toISOString()}.json`);
  };

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // --- RENDERERS ---

  if (scanning || scanning2 || scanning3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono">
        <RoyalLoader text={`SIE OPERATION IN PROGRESS`} />
        <p className="mt-4 text-xs text-slate-500 uppercase tracking-widest">
          {scanning ? "PHASE 1: OBSERVATION & INVENTORY" : 
           scanning2 ? "PHASE 2: SCORING & DEDUCTION LOGIC" : 
           "PHASE 3: SECURITY & COMPLIANCE ANALYSIS"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono selection:bg-indigo-500/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-bold uppercase tracking-widest">Site Intelligence Engine</h1>
          </div>
          <div className="flex items-center gap-6 text-[10px] text-slate-500 uppercase tracking-wider">
            <span>V 3.0.0</span>
            <span>AUTHORITY: READ-ONLY</span>
            <span>STATUS: {scanResult ? "ONLINE" : "OFFLINE"}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            onClick={runPhase1} 
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-none text-xs h-10 px-4 transition-all"
          >
            <Play className="w-3 h-3 mr-2" /> P1: Observe
          </Button>
          <Button 
            onClick={runPhase2} 
            disabled={!scanResult}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-none text-xs h-10 px-4 transition-all disabled:opacity-30"
          >
            <Activity className="w-3 h-3 mr-2" /> P2: Score
          </Button>
          <Button 
            onClick={runPhase3} 
            disabled={!scanResult}
            className="bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/50 rounded-none text-xs h-10 px-4 transition-all disabled:opacity-30 disabled:bg-white/5 disabled:border-white/10 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            <Lock className="w-3 h-3 mr-2" /> P3: Security
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'overview' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('phase1')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'phase1' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Observation
        </button>
        <button 
          onClick={() => setActiveTab('phase2')}
          disabled={!scoreResult}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${activeTab === 'phase2' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Scoring
        </button>
        <button 
          onClick={() => setActiveTab('phase3')}
          disabled={!securityResult}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${activeTab === 'phase3' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Security & Compliance
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[400px]">

        {/* OVERVIEW VIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 p-8 flex flex-col items-center justify-center text-center">
                <div className="text-[100px] font-black leading-none text-white tracking-tighter">
                  {scoreResult?.globalScore || '--'}
                </div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mt-2">Current Global Site Score</div>
                <p className="text-slate-500 text-xs mt-4 max-w-xs">Run a full scan to update this score. It reflects structure, security, performance, and compliance.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-l-2 border-red-500 pl-3">Critical Findings</h3>
                {securityResult?.findings?.filter(f => f.severity === 'critical').length > 0 ? (
                  <div className="space-y-2">
                    {securityResult.findings.filter(f => f.severity === 'critical').slice(0, 5).map((f, i) => (
                      <div key={i} className="bg-red-500/10 border border-red-500/20 p-3 rounded">
                        <div className="flex justify-between items-start">
                          <span className="text-red-400 font-bold text-xs uppercase">{f.category}</span>
                          <span className="text-red-500 text-[10px] uppercase">Critical</span>
                        </div>
                        <p className="text-white text-sm mt-1">{f.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 border border-white/10 text-center text-slate-500 text-xs uppercase tracking-widest">
                    No critical findings detected (or scan not run).
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* PHASE 1 VIEW */}
        {activeTab === 'phase1' && (
          !scanResult ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 text-slate-500">
              <Search className="w-8 h-8 mb-4 opacity-50" />
              <p className="text-xs uppercase tracking-widest">No observation data. Run Phase 1 Scan.</p>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Artifacts: System Inventory</h2>
                <Button onClick={handleExportPhase1} variant="outline" size="sm" className="h-8 text-xs border-white/10 rounded-none"><Download className="w-3 h-3 mr-2" /> JSON</Button>
              </div>

              {/* Route Map */}
              <div className="border border-white/10">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-xs font-bold text-white uppercase h-10">Route</TableHead>
                      <TableHead className="text-xs font-bold text-white uppercase h-10">Type</TableHead>
                      <TableHead className="text-xs font-bold text-white uppercase h-10">Auth</TableHead>
                      <TableHead className="text-xs font-bold text-white uppercase h-10 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scanResult.routes.map((r, i) => (
                      <TableRow key={i} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-mono text-xs text-indigo-300">{r.path}</TableCell>
                        <TableCell className="font-mono text-xs text-slate-400">{r.route_type}</TableCell>
                        <TableCell className="font-mono text-xs text-slate-400">{r.auth_required ? "REQ" : "OPEN"}</TableCell>
                        <TableCell className="font-mono text-xs text-right text-slate-400">{r.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Component Map */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Component Usage</h3>
                  <div className="border border-white/10 max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableBody>
                        {scanResult.components.sort((a,b) => b.usage_count - a.usage_count).slice(0, 10).map((c, i) => (
                          <TableRow key={i} className="border-white/5 hover:bg-white/5">
                            <TableCell className="font-mono text-xs text-white">{c.component_name}</TableCell>
                            <TableCell className="font-mono text-xs text-right text-slate-400">{c.usage_count} uses</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Feature Presence</h3>
                  <div className="border border-white/10">
                    <Table>
                      <TableBody>
                        {scanResult.features.map((f, i) => (
                          <TableRow key={i} className="border-white/5 hover:bg-white/5">
                            <TableCell className="font-mono text-xs text-white">{f.feature_name}</TableCell>
                            <TableCell className="font-mono text-xs text-right">
                              {f.implemented === 'full' ? <span className="text-green-400">FULL</span> : 
                               f.implemented === 'partial' ? <span className="text-amber-400">PARTIAL</span> : 
                               <span className="text-red-400">MISSING</span>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* PHASE 2 VIEW */}
        {activeTab === 'phase2' && scoreResult && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Scoring Engine Results</h2>
              <Button onClick={handleExportPhase2} variant="outline" size="sm" className="h-8 text-xs border-white/10 rounded-none"><Download className="w-3 h-3 mr-2" /> JSON</Button>
            </div>

            {/* Global Score */}
            <div className="flex items-center justify-center py-12 border border-white/10 bg-white/5">
              <div className="text-center">
                <div className="text-[80px] font-black leading-none text-white tracking-tighter">
                  {scoreResult.globalScore}
                </div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mt-2">Global Site Score</div>
              </div>
            </div>

            {/* Page Scores */}
            <div className="border border-white/10">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-xs font-bold text-white uppercase h-10">Page / Dimension</TableHead>
                    <TableHead className="text-xs font-bold text-white uppercase h-10 text-right">Structural</TableHead>
                    <TableHead className="text-xs font-bold text-white uppercase h-10 text-right">Security</TableHead>
                    <TableHead className="text-xs font-bold text-white uppercase h-10 text-right">Perf</TableHead>
                    <TableHead className="text-xs font-bold text-white uppercase h-10 text-right">SEO</TableHead>
                    <TableHead className="text-xs font-bold text-white uppercase h-10 text-right">Global</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scoreResult.scores.map((s, i) => (
                    <TableRow key={i} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-mono text-xs text-white font-bold">{s.page_id}</TableCell>
                      <TableCell className="font-mono text-xs text-right text-slate-400">{s.structural_score}</TableCell>
                      <TableCell className="font-mono text-xs text-right text-slate-400">{s.security_score}</TableCell>
                      <TableCell className="font-mono text-xs text-right text-slate-400">{s.performance_score}</TableCell>
                      <TableCell className="font-mono text-xs text-right text-slate-400">{s.seo_score}</TableCell>
                      <TableCell className={`font-mono text-xs text-right font-bold ${s.global_score >= 80 ? 'text-green-400' : s.global_score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {s.global_score}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Deduction Ledger */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Deduction Ledger</h3>
              <div className="border border-white/10 max-h-[300px] overflow-y-auto">
                <Table>
                  <TableBody>
                    {scoreResult.deductions.map((d, i) => (
                      <TableRow key={i} className="border-white/5 hover:bg-white/5">
                        <TableCell className="w-12 font-mono text-xs text-red-400 font-bold">-{d.weight}</TableCell>
                        <TableCell className="font-mono text-xs text-white">{d.reason}</TableCell>
                        <TableCell className="font-mono text-xs text-slate-500 text-right">{d.dimension} / {d.evidence_reference}</TableCell>
                      </TableRow>
                    ))}
                    {scoreResult.deductions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-xs text-slate-600">NO DEDUCTIONS FOUND. PERFECT SCORE.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3 VIEW */}
        {activeTab === 'phase3' && securityResult && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">Security & Compliance Findings</h2>
              <Button onClick={handleExportPhase3} variant="outline" size="sm" className="h-8 text-xs border-white/10 rounded-none"><Download className="w-3 h-3 mr-2" /> JSON</Button>
            </div>

            {/* Risk Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-500/10 border border-red-500/30 p-4">
                <div className="text-2xl font-bold text-red-500 mb-1">{securityResult.riskSummary.critical}</div>
                <div className="text-[10px] font-bold text-red-400/70 uppercase tracking-wider">Critical Risks</div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 p-4">
                <div className="text-2xl font-bold text-amber-500 mb-1">{securityResult.riskSummary.warning}</div>
                <div className="text-[10px] font-bold text-amber-400/70 uppercase tracking-wider">Warnings</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 p-4">
                <div className="text-2xl font-bold text-blue-500 mb-1">{securityResult.riskSummary.info}</div>
                <div className="text-[10px] font-bold text-blue-400/70 uppercase tracking-wider">Info Items</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4">
                <div className="text-2xl font-bold text-white mb-1">{Math.round(securityResult.complianceSnapshot.logging_coverage)}%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logging Coverage</div>
              </div>
            </div>

            {/* Security Findings Ledger */}
            <div className="border border-white/10">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-xs font-bold text-white uppercase h-10 w-24">Severity</TableHead>
                    <TableHead className="text-xs font-bold text-white uppercase h-10 w-32">Category</TableHead>
                    <TableHead className="text-xs font-bold text-white uppercase h-10">Description</TableHead>
                    <TableHead className="text-xs font-bold text-white uppercase h-10 text-right">Evidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityResult.findings.map((f, i) => (
                    <TableRow key={i} className="border-white/5 hover:bg-white/5 group">
                      <TableCell>
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide border ${
                          f.severity === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          f.severity === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {f.severity}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-400 uppercase">{f.category.replace('_', ' ')}</TableCell>
                      <TableCell className="font-mono text-xs text-white">{f.description}</TableCell>
                      <TableCell className="font-mono text-xs text-right text-slate-500 group-hover:text-indigo-400 transition-colors cursor-help" title="Click to view evidence in artifacts">
                        {f.evidence_reference}
                      </TableCell>
                    </TableRow>
                  ))}
                  {securityResult.findings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
                          <p className="text-xs text-slate-500 uppercase tracking-widest">No security findings detected.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Compliance Snapshot */}
            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Compliance Snapshot</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Logging & Audit Coverage</span>
                      <span className="text-white font-mono">{securityResult.complianceSnapshot.logging_coverage}%</span>
                    </div>
                    <div className="h-1 bg-white/10 w-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${securityResult.complianceSnapshot.logging_coverage}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Auth Pattern Consistency</span>
                      <span className="text-white font-mono">{securityResult.complianceSnapshot.auth_consistency}%</span>
                    </div>
                    <div className="h-1 bg-white/10 w-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${securityResult.complianceSnapshot.auth_consistency}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Header Health</span>
                      <span className="text-white font-mono">{securityResult.complianceSnapshot.header_health}%</span>
                    </div>
                    <div className="h-1 bg-white/10 w-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${securityResult.complianceSnapshot.header_health}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 p-6 flex flex-col justify-center">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-indigo-400 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">Phase 3 Compliance Note</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This analysis is based on observable structural artifacts and runtime headers. It does not constitute a penetration test or a legal compliance audit. Findings should be reviewed by a human security engineer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}