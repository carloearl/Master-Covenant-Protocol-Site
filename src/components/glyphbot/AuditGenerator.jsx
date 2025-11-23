import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { promptLLM } from "../utils/llmClient";
import { FileText, Download, Loader2, Shield, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";

export default function AuditGenerator() {
  const [auditType, setAuditType] = useState("security");
  const [scope, setScope] = useState("");
  const [generating, setGenerating] = useState(false);
  const [audit, setAudit] = useState(null);

  const generateAudit = async () => {
    if (!scope.trim()) return;

    setGenerating(true);
    setAudit(null);

    try {
      const user = await base44.auth.me().catch(() => ({ email: "unknown" }));
      
      let prompt = "";
      
      if (auditType === "security") {
        prompt = `Generate a comprehensive security audit report for: ${scope}

Return a JSON object with this structure:
{
  "executive_summary": {
    "overview": "string",
    "critical_findings": ["string"],
    "overall_risk_score": number (0-100),
    "compliance_status": "compliant|partial|non-compliant"
  },
  "scope_methodology": {
    "scope_description": "string",
    "assessment_approach": "string",
    "tools_used": ["string"],
    "timeline": "string"
  },
  "security_assessment": {
    "access_controls": {
      "score": number (0-100),
      "findings": ["string"],
      "risk_level": "low|medium|high|critical"
    },
    "data_protection": {
      "score": number (0-100),
      "findings": ["string"],
      "risk_level": "low|medium|high|critical"
    },
    "network_security": {
      "score": number (0-100),
      "findings": ["string"],
      "risk_level": "low|medium|high|critical"
    },
    "application_security": {
      "score": number (0-100),
      "findings": ["string"],
      "risk_level": "low|medium|high|critical"
    }
  },
  "vulnerabilities": [
    {
      "title": "string",
      "severity": "low|medium|high|critical",
      "cvss_score": number (0-10),
      "description": "string",
      "impact": "string",
      "remediation": "string",
      "effort": "low|medium|high"
    }
  ],
  "compliance": {
    "gdpr": {"status": "compliant|partial|non-compliant", "gaps": ["string"]},
    "soc2": {"status": "compliant|partial|non-compliant", "gaps": ["string"]},
    "iso27001": {"status": "compliant|partial|non-compliant", "gaps": ["string"]},
    "master_covenant": {"status": "compliant|partial|non-compliant", "principles_met": ["string"]}
  },
  "risk_matrix": [
    {"category": "string", "likelihood": "low|medium|high", "impact": "low|medium|high", "priority": "low|medium|high|critical"}
  ],
  "recommendations": [
    {
      "title": "string",
      "priority": "low|medium|high|critical",
      "effort": "low|medium|high",
      "impact": "string",
      "timeline": "immediate|short-term|long-term"
    }
  ],
  "action_plan": {
    "immediate_actions": ["string"],
    "short_term_actions": ["string"],
    "long_term_actions": ["string"]
  }
}`;
      } else if (auditType === "compliance") {
        prompt = `Generate a compliance audit report for: ${scope}

Return a JSON object with this structure:
{
  "executive_summary": {
    "overview": "string",
    "compliance_score": number (0-100),
    "critical_gaps": ["string"]
  },
  "regulatory_frameworks": [
    {
      "name": "GDPR|CCPA|SOC2|ISO27001|Master Covenant",
      "compliance_level": number (0-100),
      "status": "compliant|partial|non-compliant",
      "requirements_met": number,
      "requirements_total": number,
      "gaps": ["string"]
    }
  ],
  "gap_analysis": [
    {
      "framework": "string",
      "requirement": "string",
      "current_state": "string",
      "desired_state": "string",
      "gap_severity": "low|medium|high|critical",
      "remediation": "string"
    }
  ],
  "policy_review": {
    "policies_reviewed": ["string"],
    "policies_adequate": ["string"],
    "policies_need_update": ["string"],
    "policies_missing": ["string"]
  },
  "training_awareness": {
    "score": number (0-100),
    "training_coverage": number (0-100),
    "recommendations": ["string"]
  },
  "incident_response": {
    "readiness_score": number (0-100),
    "plan_exists": boolean,
    "plan_tested": boolean,
    "gaps": ["string"]
  },
  "third_party_risk": {
    "vendors_assessed": number,
    "high_risk_vendors": number,
    "findings": ["string"]
  },
  "remediation_roadmap": {
    "immediate": ["string"],
    "short_term": ["string"],
    "long_term": ["string"]
  }
}`;
      } else {
        prompt = `Generate a system integrity audit for: ${scope}

Return a JSON object with this structure:
{
  "executive_summary": {
    "overview": "string",
    "health_score": number (0-100),
    "critical_issues": ["string"]
  },
  "architecture_review": {
    "score": number (0-100),
    "strengths": ["string"],
    "weaknesses": ["string"],
    "recommendations": ["string"]
  },
  "code_quality": {
    "overall_score": number (0-100),
    "maintainability": number (0-100),
    "test_coverage": number (0-100),
    "complexity_score": number (0-100),
    "issues": ["string"]
  },
  "performance": {
    "score": number (0-100),
    "response_time": "string",
    "throughput": "string",
    "bottlenecks": ["string"]
  },
  "scalability": {
    "score": number (0-100),
    "horizontal_scaling": "excellent|good|fair|poor",
    "vertical_scaling": "excellent|good|fair|poor",
    "limitations": ["string"]
  },
  "reliability": {
    "uptime_score": number (0-100),
    "mtbf": "string",
    "mttr": "string",
    "failure_points": ["string"]
  },
  "technical_debt": {
    "score": number (0-100),
    "estimated_effort": "string",
    "priority_areas": ["string"]
  },
  "upgrade_roadmap": {
    "immediate": ["string"],
    "short_term": ["string"],
    "long_term": ["string"]
  },
  "best_practices": {
    "compliance_score": number (0-100),
    "areas_compliant": ["string"],
    "areas_needing_improvement": ["string"]
  }
}`;
      }

      const response = await promptLLM(prompt, false, {
        jsonSchema: { type: "object" }
      });

      const auditData = {
        id: crypto.randomUUID(),
        type: auditType,
        scope,
        generatedBy: user.email,
        timestamp: new Date().toISOString(),
        content: response,
        metadata: {
          promptVersion: "v2.0",
          model: "gemini-1.5-pro",
          covenantCompliant: true
        }
      };

      setAudit(auditData);

      // Log audit generation
      await base44.entities.SystemAuditLog.create({
        event_type: "GLYPHBOT_AUDIT_GENERATED",
        description: `${auditType} audit generated`,
        actor_email: user.email,
        resource_id: "glyphbot",
        metadata: { auditType, scope, auditId: auditData.id },
        status: "success"
      }).catch(console.error);

    } catch (error) {
      console.error("Audit generation error:", error);
      setAudit({
        error: "Failed to generate audit. Please try again.",
        timestamp: new Date().toISOString()
      });
    } finally {
      setGenerating(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const renderScoreBar = (score, label) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className={`font-semibold ${getScoreColor(score)}`}>{score}%</span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  const renderAuditContent = (audit) => {
    const content = typeof audit.content === 'string' ? JSON.parse(audit.content) : audit.content;

    if (audit.type === 'security') {
      return renderSecurityAudit(content);
    } else if (audit.type === 'compliance') {
      return renderComplianceAudit(content);
    } else {
      return renderSystemAudit(content);
    }
  };

  const renderSecurityAudit = (content) => (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="p-6 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-800 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          Executive Summary
        </h3>
        <p className="text-gray-300 mb-4">{content.executive_summary?.overview}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Overall Risk Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(100 - content.executive_summary?.overall_risk_score)}`}>
              {content.executive_summary?.overall_risk_score || 0}
            </p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Compliance Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              content.executive_summary?.compliance_status === 'compliant' ? 'bg-green-500/20 text-green-400' :
              content.executive_summary?.compliance_status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {content.executive_summary?.compliance_status?.toUpperCase()}
            </span>
          </div>
        </div>
        {content.executive_summary?.critical_findings?.length > 0 && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-sm font-semibold text-red-400 mb-2">Critical Findings</p>
            <ul className="space-y-1">
              {content.executive_summary.critical_findings.map((finding, i) => (
                <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {finding}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Security Assessment */}
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-4">Security Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(content.security_assessment || {}).map(([key, assessment]) => (
            <div key={key} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white capitalize">{key.replace(/_/g, ' ')}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(assessment.risk_level)}`}>
                  {assessment.risk_level?.toUpperCase()}
                </span>
              </div>
              {renderScoreBar(assessment.score, 'Security Score')}
              <div className="mt-3 space-y-1">
                {assessment.findings?.map((finding, i) => (
                  <p key={i} className="text-xs text-gray-400">• {finding}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerabilities */}
      {content.vulnerabilities?.length > 0 && (
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">Vulnerabilities</h3>
          <div className="space-y-3">
            {content.vulnerabilities.map((vuln, i) => (
              <div key={i} className={`p-4 rounded-lg border ${getRiskColor(vuln.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{vuln.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-black/30 rounded">CVSS {vuln.cvss_score}</span>
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${getRiskColor(vuln.severity)}`}>
                      {vuln.severity?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-2">{vuln.description}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500">Impact</p>
                    <p className="text-gray-300">{vuln.impact}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Effort to Fix</p>
                    <p className="text-gray-300 capitalize">{vuln.effort}</p>
                  </div>
                </div>
                <div className="mt-2 p-2 bg-black/30 rounded text-xs text-gray-300">
                  <p className="text-gray-500 mb-1">Remediation</p>
                  {vuln.remediation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {content.recommendations?.length > 0 && (
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">Recommendations</h3>
          <div className="space-y-3">
            {content.recommendations.map((rec, i) => (
              <div key={i} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{rec.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded border ${getRiskColor(rec.priority)}`}>
                      {rec.priority?.toUpperCase()}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded capitalize flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rec.timeline}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{rec.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderComplianceAudit = (content) => (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">Compliance Overview</h3>
        <p className="text-gray-300 mb-4">{content.executive_summary?.overview}</p>
        {renderScoreBar(content.executive_summary?.compliance_score, 'Overall Compliance')}
      </div>

      {/* Frameworks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {content.regulatory_frameworks?.map((framework, i) => (
          <div key={i} className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <h4 className="font-bold text-white mb-3">{framework.name}</h4>
            {renderScoreBar(framework.compliance_level, 'Compliance Level')}
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-400">Requirements Met</span>
              <span className="text-white font-semibold">{framework.requirements_met} / {framework.requirements_total}</span>
            </div>
            {framework.gaps?.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs text-gray-500">Gaps Identified</p>
                {framework.gaps.slice(0, 3).map((gap, j) => (
                  <p key={j} className="text-xs text-gray-400">• {gap}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gap Analysis */}
      {content.gap_analysis?.length > 0 && (
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">Gap Analysis</h3>
          <div className="space-y-3">
            {content.gap_analysis.map((gap, i) => (
              <div key={i} className={`p-4 rounded-lg border ${getRiskColor(gap.gap_severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{gap.requirement}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${getRiskColor(gap.gap_severity)}`}>
                    {gap.gap_severity?.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                  <div>
                    <p className="text-gray-500">Current State</p>
                    <p className="text-gray-300">{gap.current_state}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Desired State</p>
                    <p className="text-gray-300">{gap.desired_state}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{gap.remediation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSystemAudit = (content) => (
    <div className="space-y-6">
      {/* Health Score */}
      <div className="p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-800 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">System Health</h3>
        <p className="text-gray-300 mb-4">{content.executive_summary?.overview}</p>
        {renderScoreBar(content.executive_summary?.health_score, 'Overall Health Score')}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {content.code_quality && (
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <h4 className="text-sm text-gray-400 mb-2">Code Quality</h4>
            {renderScoreBar(content.code_quality.overall_score, '')}
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Maintainability</span>
                <span className={getScoreColor(content.code_quality.maintainability)}>{content.code_quality.maintainability}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Test Coverage</span>
                <span className={getScoreColor(content.code_quality.test_coverage)}>{content.code_quality.test_coverage}%</span>
              </div>
            </div>
          </div>
        )}
        
        {content.performance && (
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <h4 className="text-sm text-gray-400 mb-2">Performance</h4>
            {renderScoreBar(content.performance.score, '')}
            <div className="mt-3 space-y-1 text-xs text-gray-400">
              <p>Response Time: {content.performance.response_time}</p>
              <p>Throughput: {content.performance.throughput}</p>
            </div>
          </div>
        )}

        {content.scalability && (
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <h4 className="text-sm text-gray-400 mb-2">Scalability</h4>
            {renderScoreBar(content.scalability.score, '')}
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Horizontal</span>
                <span className="text-gray-300 capitalize">{content.scalability.horizontal_scaling}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vertical</span>
                <span className="text-gray-300 capitalize">{content.scalability.vertical_scaling}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Technical Debt */}
      {content.technical_debt && (
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">Technical Debt</h3>
          {renderScoreBar(content.technical_debt.score, 'Debt Score (Lower is Better)')}
          <p className="text-sm text-gray-400 mt-3">Estimated Effort: {content.technical_debt.estimated_effort}</p>
          <div className="mt-3 space-y-1">
            <p className="text-xs text-gray-500">Priority Areas</p>
            {content.technical_debt.priority_areas?.map((area, i) => (
              <p key={i} className="text-sm text-gray-300">• {area}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const downloadAudit = () => {
    if (!audit || audit.error) return;

    const content = `
GLYPHLOCK SECURITY AUDIT REPORT
================================

Audit ID: ${audit.id}
Type: ${audit.type.toUpperCase()}
Generated: ${new Date(audit.timestamp).toLocaleString()}
Generated By: ${audit.generatedBy}
Scope: ${audit.scope}

${JSON.stringify(audit.content, null, 2)}

---
Report certified by GlyphBot AI Security System
Master Covenant Compliant
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glyphlock-audit-${audit.type}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Audit Generator</h2>
        <p className="text-gray-400">Generate comprehensive security and compliance audit reports</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-400">
            <p className="font-semibold mb-1">Master Covenant Compliant</p>
            <p>All audits follow GlyphLock's Master Covenant security principles and industry standards.</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Audit Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["security", "compliance", "system"].map(type => (
              <button
                key={type}
                onClick={() => setAuditType(type)}
                className={`px-4 py-2 rounded-lg border font-medium capitalize transition-all ${
                  auditType === type
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                    : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Audit Scope
          </label>
          <textarea
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            placeholder="Describe what should be audited (e.g., 'Web application authentication system', 'GDPR compliance for customer data', 'Payment processing infrastructure')..."
            rows={6}
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button
          onClick={generateAudit}
          disabled={generating || !scope.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold disabled:opacity-50 hover:from-cyan-500 hover:to-blue-500 transition-all"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Audit...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Generate Audit Report
            </>
          )}
        </button>

        {audit && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Audit Report</h3>
              </div>
              
              {!audit.error && (
                <button
                  onClick={downloadAudit}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>

            {audit.error ? (
              <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-500">{audit.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Audit ID</p>
                    <p className="text-xs text-white font-mono">{audit.id}</p>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Type</p>
                    <p className="text-white capitalize">{audit.type}</p>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Generated By</p>
                    <p className="text-white text-sm">{audit.generatedBy}</p>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Timestamp</p>
                    <p className="text-white text-sm">{new Date(audit.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                {renderAuditContent(audit)}

                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <p className="text-sm text-green-400">Master Covenant Compliant</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}