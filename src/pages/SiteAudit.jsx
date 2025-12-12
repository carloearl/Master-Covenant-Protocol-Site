import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Zap, 
  Search, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Clock,
  FileCode,
  TrendingUp,
  Loader2,
  Play,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';
import HoverTooltip from '@/components/ui/HoverTooltip';

export default function SiteAudit() {
  const [loading, setLoading] = useState(false);
  const [audits, setAudits] = useState([]);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadAudits();
  }, []);

  async function loadUser() {
    try {
      const userData = await base44.auth.me();
      if (!userData || userData.role !== 'admin') {
        toast.error('Admin access required');
        window.location.href = '/';
      }
      setUser(userData);
    } catch (error) {
      toast.error('Authentication failed');
      window.location.href = '/';
    }
  }

  async function loadAudits() {
    try {
      const results = await base44.entities.SiteAudit.list('-created_date', 20);
      setAudits(results);
      if (results.length > 0) {
        setSelectedAudit(results[0]);
      }
    } catch (error) {
      console.error('Failed to load audits:', error);
    }
  }

  async function runAudit(auditType, autoFix = false) {
    setLoading(true);
    toast.info(`Starting ${auditType} audit...`);

    try {
      const { data } = await base44.functions.invoke('runSiteAudit', {
        audit_type: auditType,
        auto_fix: autoFix
      });

      toast.success(`Audit completed! Score: ${data.overall_score}/100`);
      await loadAudits();
    } catch (error) {
      console.error('Audit failed:', error);
      toast.error('Audit failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/50',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      info: 'bg-slate-500/20 text-slate-400 border-slate-500/50'
    };
    return colors[severity] || colors.info;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-950/20 to-black">
        <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="AI Site Audit | GlyphLock Security"
        description="Automated security, performance, SEO, and UX audit powered by AI"
      />

      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950/20 to-black py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-400" />
              AI Site Audit
            </h1>
            <p className="text-slate-400">
              Automated security, performance, SEO & UX analysis powered by Gemini 2.0
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <HoverTooltip content="Comprehensive scan: security + performance + SEO + UX">
              <Button
                onClick={() => runAudit('full')}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 min-h-[48px]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                Full Audit
              </Button>
            </HoverTooltip>

            <HoverTooltip content="Scan for OWASP Top 10 vulnerabilities">
              <Button
                onClick={() => runAudit('security')}
                disabled={loading}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 min-h-[48px]"
              >
                <Shield className="w-5 h-5 mr-2" />
                Security
              </Button>
            </HoverTooltip>

            <HoverTooltip content="Identify performance bottlenecks">
              <Button
                onClick={() => runAudit('performance')}
                disabled={loading}
                variant="outline"
                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 min-h-[48px]"
              >
                <Zap className="w-5 h-5 mr-2" />
                Performance
              </Button>
            </HoverTooltip>

            <HoverTooltip content="Check SEO optimization">
              <Button
                onClick={() => runAudit('seo')}
                disabled={loading}
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10 min-h-[48px]"
              >
                <Search className="w-5 h-5 mr-2" />
                SEO
              </Button>
            </HoverTooltip>

            <HoverTooltip content="Analyze user experience and accessibility">
              <Button
                onClick={() => runAudit('ux')}
                disabled={loading}
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 min-h-[48px]"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                UX
              </Button>
            </HoverTooltip>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audit History */}
            <Card className="bg-white/5 border-blue-500/20">
              <CardHeader className="border-b border-blue-500/20">
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  <span>Recent Audits</span>
                  <HoverTooltip content="Refresh audit history">
                    <Button
                      onClick={loadAudits}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </HoverTooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {audits.map((audit) => (
                    <button
                      key={audit.id}
                      onClick={() => setSelectedAudit(audit)}
                      className={`w-full p-4 text-left border-b border-slate-800 hover:bg-white/5 transition-colors ${
                        selectedAudit?.id === audit.id ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                          {audit.audit_type}
                        </Badge>
                        {audit.status === 'completed' && audit.overall_score && (
                          <span className={`text-2xl font-bold ${getScoreColor(audit.overall_score)}`}>
                            {audit.overall_score}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(audit.created_date).toLocaleString()}
                      </div>
                      {audit.auto_fixes_applied > 0 && (
                        <div className="text-xs text-green-400 mt-1">
                          ✓ {audit.auto_fixes_applied} auto-fixes applied
                        </div>
                      )}
                    </button>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Audit Details */}
            <Card className="lg:col-span-2 bg-white/5 border-blue-500/20">
              <CardHeader className="border-b border-blue-500/20">
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Audit Results</span>
                  {selectedAudit && (
                    <div className="flex items-center gap-2">
                      <HoverTooltip content="Run audit and auto-fix all issues">
                        <Button
                          onClick={() => runAudit(selectedAudit.audit_type, true)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Auto-Fix All
                        </Button>
                      </HoverTooltip>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!selectedAudit ? (
                  <div className="text-center py-20 text-slate-400">
                    <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select an audit to view results</p>
                  </div>
                ) : (
                  <Tabs defaultValue="security" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                      <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security
                        {selectedAudit.security_findings?.length > 0 && (
                          <Badge className="ml-1 bg-red-500/20 text-red-400">
                            {selectedAudit.security_findings.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="performance" className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Performance
                        {selectedAudit.performance_findings?.length > 0 && (
                          <Badge className="ml-1 bg-yellow-500/20 text-yellow-400">
                            {selectedAudit.performance_findings.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="seo" className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        SEO
                        {selectedAudit.seo_findings?.length > 0 && (
                          <Badge className="ml-1 bg-green-500/20 text-green-400">
                            {selectedAudit.seo_findings.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="ux" className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        UX
                        {selectedAudit.ux_findings?.length > 0 && (
                          <Badge className="ml-1 bg-purple-500/20 text-purple-400">
                            {selectedAudit.ux_findings.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>

                    {['security', 'performance', 'seo', 'ux'].map(type => (
                      <TabsContent key={type} value={type}>
                        <ScrollArea className="h-[500px]">
                          <div className="space-y-4 pr-4">
                            {(selectedAudit[`${type}_findings`] || []).map((finding, idx) => (
                              <Card key={idx} className="bg-white/5 border-slate-700">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge className={getSeverityColor(finding.severity)}>
                                          {finding.severity}
                                        </Badge>
                                        {finding.auto_fixable && (
                                          <Badge className="bg-green-500/20 text-green-400">
                                            Auto-fixable
                                          </Badge>
                                        )}
                                      </div>
                                      <h4 className="text-white font-bold mb-1">{finding.title}</h4>
                                      {finding.owasp_category && (
                                        <div className="text-xs text-red-400 mb-2">
                                          OWASP: {finding.owasp_category} | CWE: {finding.cwe_id}
                                        </div>
                                      )}
                                      <p className="text-sm text-slate-300 mb-2">{finding.description}</p>
                                      {finding.file_path && (
                                        <div className="text-xs text-blue-400 mb-2">
                                          📁 {finding.file_path}
                                          {finding.line_number && ` : Line ${finding.line_number}`}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="bg-slate-900/50 rounded-lg p-3">
                                    <div className="text-xs text-green-400 mb-1 font-semibold">
                                      ✓ Recommendation:
                                    </div>
                                    <p className="text-xs text-slate-300">{finding.recommendation}</p>
                                    {finding.fix_code && (
                                      <pre className="mt-2 p-2 bg-black/50 rounded text-xs text-cyan-300 overflow-x-auto">
                                        {finding.fix_code}
                                      </pre>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            
                            {(selectedAudit[`${type}_findings`] || []).length === 0 && (
                              <div className="text-center py-12 text-slate-400">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
                                <p>No {type} issues found!</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}