import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Download, Shield, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AuditGenerator() {
  const [auditConfig, setAuditConfig] = useState({
    project_name: "",
    audit_type: "full",
    description: "",
    scope: "",
    technology_stack: "",
    deployment_environment: ""
  });
  const [auditReport, setAuditReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAudit = async () => {
    if (!auditConfig.project_name) return;
    
    setIsGenerating(true);
    setAuditReport(null);

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional security auditor conducting a REAL, THOROUGH security audit. Analyze the project details below and provide HONEST, VARIED, and SPECIFIC findings based on the actual information provided. DO NOT provide generic results - make findings relevant to the specific project type, technology stack, and scope described.

Project Details:
- Name: ${auditConfig.project_name}
- Type: ${auditConfig.audit_type}
- Description: ${auditConfig.description || "Not provided"}
- Scope: ${auditConfig.scope || "Not provided"}
- Technology Stack: ${auditConfig.technology_stack || "Not specified"}
- Environment: ${auditConfig.deployment_environment || "Not specified"}

IMPORTANT: Base your analysis on:
1. The specific technologies mentioned
2. The actual project scope and features
3. The deployment environment
4. Industry best practices for this type of project
5. OWASP Top 10 and CWE standards relevant to this stack

Provide a REALISTIC and VARIED security audit in JSON format:

{
  "executive_summary": "2-3 paragraph honest assessment of security posture",
  "audit_scope": ["List 5-8 specific areas actually audited based on the project"],
  "methodology": "Detailed description of audit methodology used (penetration testing, code review, configuration analysis, etc.)",
  "test_categories": [
    {
      "category": "Authentication & Authorization",
      "tests_performed": ["specific test 1", "test 2", "test 3"],
      "pass_rate": 0-100,
      "findings_count": number
    },
    {
      "category": "Input Validation & Injection Prevention",
      "tests_performed": ["specific test 1", "test 2"],
      "pass_rate": 0-100,
      "findings_count": number
    },
    {
      "category": "Session Management",
      "tests_performed": ["specific test 1", "test 2"],
      "pass_rate": 0-100,
      "findings_count": number
    },
    {
      "category": "Cryptography",
      "tests_performed": ["specific test 1", "test 2"],
      "pass_rate": 0-100,
      "findings_count": number
    },
    {
      "category": "Error Handling & Logging",
      "tests_performed": ["specific test 1", "test 2"],
      "pass_rate": 0-100,
      "findings_count": number
    },
    {
      "category": "Configuration & Deployment",
      "tests_performed": ["specific test 1", "test 2"],
      "pass_rate": 0-100,
      "findings_count": number
    }
  ],
  "findings": [
    {
      "id": "unique-id-with-category-prefix",
      "severity": "Critical"|"High"|"Medium"|"Low" (vary based on actual risks),
      "title": "Specific, detailed vulnerability name",
      "description": "Technical description of the specific issue found",
      "affected_component": "Exact component/file/endpoint affected",
      "impact": "Real business and technical impact",
      "likelihood": "High"|"Medium"|"Low",
      "cvss_score": number between 1-10,
      "cwe_id": "Relevant CWE number",
      "recommendation": "Specific, actionable remediation steps",
      "effort": "Low"|"Medium"|"High",
      "status": "Open"
    }
  ],
  "positive_findings": [
    "List 3-5 things done well (security strengths)"
  ],
  "risk_assessment": {
    "overall_risk": "Critical"|"High"|"Moderate"|"Low" (be honest),
    "technical_risk": 1-10 (vary based on findings),
    "business_risk": 1-10 (vary based on findings),
    "compliance_risk": 1-10 (vary based on findings),
    "risk_trend": "Improving"|"Stable"|"Declining",
    "time_to_remediate": "Estimated hours/days"
  },
  "compliance_status": [
    {
      "standard": "OWASP Top 10"|"PCI-DSS"|"GDPR"|"SOC2"|"HIPAA",
      "status": "Compliant"|"Partial"|"Non-Compliant",
      "score": 0-100,
      "gaps": ["specific gap 1", "gap 2"]
    }
  ],
  "security_controls": [
    {
      "category": "Network Security"|"Application Security"|"Data Protection"|etc,
      "implemented": number,
      "missing": number,
      "effectiveness": "High"|"Medium"|"Low"
    }
  ],
  "attack_surface_analysis": {
    "external_endpoints": number,
    "api_endpoints": number,
    "authentication_points": number,
    "data_stores": number,
    "third_party_integrations": number,
    "high_value_targets": ["target 1", "target 2"]
  },
  "recommendations": [
    "Prioritized, specific action items (5-10)"
  ],
  "action_plan": [
    {
      "priority": "Critical"|"High"|"Medium"|"Low",
      "action": "Specific action item",
      "timeline": "Realistic timeline",
      "owner": "Role responsible",
      "cost": "Low"|"Medium"|"High"
    }
  ],
  "metrics": {
    "total_tests": number,
    "passed": number,
    "failed": number,
    "warnings": number,
    "vulnerabilities_by_severity": {
      "critical": number,
      "high": number,
      "medium": number,
      "low": number
    }
  },
  "conclusion": "Honest 2-3 paragraph conclusion with specific next steps and overall assessment"
}

CRITICAL REQUIREMENTS:
- Findings MUST be specific to the project type and technologies mentioned
- Risk scores MUST vary based on actual findings
- Test results MUST show realistic pass/fail rates (not perfect scores)
- Include BOTH vulnerabilities AND positive findings
- Be HONEST - if limited info provided, state assumptions made
- Provide ACTIONABLE recommendations
- Include realistic effort and cost estimates`,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            audit_scope: { type: "array", items: { type: "string" } },
            methodology: { type: "string" },
            test_categories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  tests_performed: { type: "array", items: { type: "string" } },
                  pass_rate: { type: "number" },
                  findings_count: { type: "number" }
                }
              }
            },
            findings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  severity: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  affected_component: { type: "string" },
                  impact: { type: "string" },
                  likelihood: { type: "string" },
                  cvss_score: { type: "number" },
                  cwe_id: { type: "string" },
                  recommendation: { type: "string" },
                  effort: { type: "string" },
                  status: { type: "string" }
                }
              }
            },
            positive_findings: { type: "array", items: { type: "string" } },
            risk_assessment: {
              type: "object",
              properties: {
                overall_risk: { type: "string" },
                technical_risk: { type: "number" },
                business_risk: { type: "number" },
                compliance_risk: { type: "number" },
                risk_trend: { type: "string" },
                time_to_remediate: { type: "string" }
              }
            },
            compliance_status: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  standard: { type: "string" },
                  status: { type: "string" },
                  score: { type: "number" },
                  gaps: { type: "array", items: { type: "string" } }
                }
              }
            },
            security_controls: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  implemented: { type: "number" },
                  missing: { type: "number" },
                  effectiveness: { type: "string" }
                }
              }
            },
            attack_surface_analysis: {
              type: "object",
              properties: {
                external_endpoints: { type: "number" },
                api_endpoints: { type: "number" },
                authentication_points: { type: "number" },
                data_stores: { type: "number" },
                third_party_integrations: { type: "number" },
                high_value_targets: { type: "array", items: { type: "string" } }
              }
            },
            recommendations: { type: "array", items: { type: "string" } },
            action_plan: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: { type: "string" },
                  action: { type: "string" },
                  timeline: { type: "string" },
                  owner: { type: "string" },
                  cost: { type: "string" }
                }
              }
            },
            metrics: {
              type: "object",
              properties: {
                total_tests: { type: "number" },
                passed: { type: "number" },
                failed: { type: "number" },
                warnings: { type: "number" },
                vulnerabilities_by_severity: {
                  type: "object",
                  properties: {
                    critical: { type: "number" },
                    high: { type: "number" },
                    medium: { type: "number" },
                    low: { type: "number" }
                  }
                }
              }
            },
            conclusion: { type: "string" }
          }
        }
      });

      setAuditReport(result);
    } catch (error) {
      console.error("Audit generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!auditReport) return;
    
    const reportText = `
╔════════════════════════════════════════════════════════════════╗
║            PROFESSIONAL SECURITY AUDIT REPORT                  ║
╚════════════════════════════════════════════════════════════════╝

Project: ${auditConfig.project_name}
Date: ${new Date().toLocaleDateString()}
Audit Type: ${auditConfig.audit_type}
Auditor: GlyphBot Advanced Security Systems

════════════════════════════════════════════════════════════════

EXECUTIVE SUMMARY
-----------------
${auditReport.executive_summary}

AUDIT SCOPE
-----------
${auditReport.audit_scope.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

METHODOLOGY
-----------
${auditReport.methodology}

TEST RESULTS SUMMARY
--------------------
Total Tests Performed: ${auditReport.metrics.total_tests}
Tests Passed: ${auditReport.metrics.passed}
Tests Failed: ${auditReport.metrics.failed}
Warnings: ${auditReport.metrics.warnings}

Vulnerabilities by Severity:
  • Critical: ${auditReport.metrics.vulnerabilities_by_severity.critical}
  • High: ${auditReport.metrics.vulnerabilities_by_severity.high}
  • Medium: ${auditReport.metrics.vulnerabilities_by_severity.medium}
  • Low: ${auditReport.metrics.vulnerabilities_by_severity.low}

TEST CATEGORIES
---------------
${auditReport.test_categories.map(cat => `
${cat.category}
  Pass Rate: ${cat.pass_rate}%
  Findings: ${cat.findings_count}
  Tests: ${cat.tests_performed.join(', ')}
`).join('\n')}

SECURITY FINDINGS
-----------------
${auditReport.findings.map((f, idx) => `
${idx + 1}. [${f.severity}] ${f.title}
   ID: ${f.id}
   CVSS Score: ${f.cvss_score}/10
   CWE: ${f.cwe_id}
   Status: ${f.status}
   Likelihood: ${f.likelihood}
   Effort to Fix: ${f.effort}
   
   Affected Component: ${f.affected_component}
   
   Description: ${f.description}
   
   Impact: ${f.impact}
   
   Recommendation: ${f.recommendation}
`).join('\n')}

POSITIVE FINDINGS
-----------------
${auditReport.positive_findings.map((pf, idx) => `${idx + 1}. ${pf}`).join('\n')}

ATTACK SURFACE ANALYSIS
------------------------
External Endpoints: ${auditReport.attack_surface_analysis.external_endpoints}
API Endpoints: ${auditReport.attack_surface_analysis.api_endpoints}
Authentication Points: ${auditReport.attack_surface_analysis.authentication_points}
Data Stores: ${auditReport.attack_surface_analysis.data_stores}
Third-Party Integrations: ${auditReport.attack_surface_analysis.third_party_integrations}

High-Value Targets:
${auditReport.attack_surface_analysis.high_value_targets.map((t, idx) => `  ${idx + 1}. ${t}`).join('\n')}

RISK ASSESSMENT
---------------
Overall Risk: ${auditReport.risk_assessment.overall_risk}
Technical Risk: ${auditReport.risk_assessment.technical_risk}/10
Business Risk: ${auditReport.risk_assessment.business_risk}/10
Compliance Risk: ${auditReport.risk_assessment.compliance_risk}/10
Risk Trend: ${auditReport.risk_assessment.risk_trend}
Time to Remediate: ${auditReport.risk_assessment.time_to_remediate}

COMPLIANCE STATUS
-----------------
${auditReport.compliance_status.map(comp => `
${comp.standard}
  Status: ${comp.status}
  Score: ${comp.score}%
  Gaps: ${comp.gaps.join(', ')}
`).join('\n')}

SECURITY CONTROLS
-----------------
${auditReport.security_controls.map(ctrl => `
${ctrl.category}
  Implemented: ${ctrl.implemented}
  Missing: ${ctrl.missing}
  Effectiveness: ${ctrl.effectiveness}
`).join('\n')}

RECOMMENDATIONS
---------------
${auditReport.recommendations.map((r, idx) => `${idx + 1}. ${r}`).join('\n')}

ACTION PLAN
-----------
${auditReport.action_plan.map((item, idx) => `
${idx + 1}. [${item.priority}] ${item.action}
   Timeline: ${item.timeline}
   Owner: ${item.owner}
   Cost: ${item.cost}
`).join('\n')}

CONCLUSION
----------
${auditReport.conclusion}

════════════════════════════════════════════════════════════════
Report Generated: ${new Date().toLocaleString()}
GlyphBot Advanced Security Systems - Professional Grade Auditing
════════════════════════════════════════════════════════════════
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${auditConfig.project_name.replace(/\s+/g, '_')}_Security_Audit_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity) => {
    if (severity === "Critical") return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/50" };
    if (severity === "High") return { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/50" };
    if (severity === "Medium") return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/50" };
    return { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/50" };
  };

  const getRiskTrendIcon = (trend) => {
    if (trend === "Improving") return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === "Declining") return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <div className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5" />
            Advanced Security Audit Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Project Name *</Label>
              <Input
                value={auditConfig.project_name}
                onChange={(e) => setAuditConfig({...auditConfig, project_name: e.target.value})}
                placeholder="e.g., E-commerce Platform, Banking App"
                className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label className="text-white">Audit Type</Label>
              <Select 
                value={auditConfig.audit_type} 
                onValueChange={(value) => setAuditConfig({...auditConfig, audit_type: value})}
              >
                <SelectTrigger className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-blue-900/90 backdrop-blur-md border-blue-500/30">
                  <SelectItem value="full" className="text-white">Full Security Audit</SelectItem>
                  <SelectItem value="smart-contract" className="text-white">Smart Contract Audit</SelectItem>
                  <SelectItem value="penetration" className="text-white">Penetration Test</SelectItem>
                  <SelectItem value="compliance" className="text-white">Compliance Review</SelectItem>
                  <SelectItem value="code-review" className="text-white">Code Review</SelectItem>
                  <SelectItem value="web-application" className="text-white">Web Application Audit</SelectItem>
                  <SelectItem value="api" className="text-white">API Security Audit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-white">Project Description *</Label>
            <Textarea
              value={auditConfig.description}
              onChange={(e) => setAuditConfig({...auditConfig, description: e.target.value})}
              placeholder="Describe the project in detail: What does it do? What are the main features? What type of data does it handle? Who are the users?"
              className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-white">Technology Stack</Label>
            <Input
              value={auditConfig.technology_stack}
              onChange={(e) => setAuditConfig({...auditConfig, technology_stack: e.target.value})}
              placeholder="e.g., React, Node.js, MongoDB, AWS, Docker"
              className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
            />
          </div>

          <div>
            <Label className="text-white">Deployment Environment</Label>
            <Input
              value={auditConfig.deployment_environment}
              onChange={(e) => setAuditConfig({...auditConfig, deployment_environment: e.target.value})}
              placeholder="e.g., AWS Cloud, On-Premise, Kubernetes, Serverless"
              className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
            />
          </div>

          <div>
            <Label className="text-white">Audit Scope *</Label>
            <Textarea
              value={auditConfig.scope}
              onChange={(e) => setAuditConfig({...auditConfig, scope: e.target.value})}
              placeholder="Define what should be audited: APIs, authentication, payment processing, data storage, third-party integrations, etc."
              className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
              rows={3}
            />
          </div>

          <Button
            onClick={generateAudit}
            disabled={isGenerating || !auditConfig.project_name || !auditConfig.description || !auditConfig.scope}
            className="w-full bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-500/50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Performing Comprehensive Security Audit...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Generate Professional Audit Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {auditReport && (
        <div className="space-y-4">
          {/* Header Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-red-500/10 backdrop-blur-md border-red-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{auditReport.metrics.vulnerabilities_by_severity.critical}</div>
                <div className="text-xs text-white/60 mt-1">Critical</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-500/10 backdrop-blur-md border-orange-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-400">{auditReport.metrics.vulnerabilities_by_severity.high}</div>
                <div className="text-xs text-white/60 mt-1">High</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/10 backdrop-blur-md border-yellow-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">{auditReport.metrics.vulnerabilities_by_severity.medium}</div>
                <div className="text-xs text-white/60 mt-1">Medium</div>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10 backdrop-blur-md border-green-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{auditReport.metrics.passed}/{auditReport.metrics.total_tests}</div>
                <div className="text-xs text-white/60 mt-1">Tests Passed</div>
              </CardContent>
            </Card>
          </div>

          {/* Executive Summary */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Audit Report: {auditConfig.project_name}</CardTitle>
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  size="sm"
                  className="border-blue-500/50 hover:bg-blue-500/20 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Executive Summary</h4>
                  <p className="text-sm text-white leading-relaxed whitespace-pre-line">{auditReport.executive_summary}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Methodology</h4>
                  <p className="text-sm text-white leading-relaxed">{auditReport.methodology}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">Audit Scope</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-white">
                    {auditReport.audit_scope.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Categories */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Test Results by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditReport.test_categories.map((cat, idx) => (
                  <div key={idx} className="bg-blue-900/30 backdrop-blur-md border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{cat.category}</h4>
                      <Badge className={
                        cat.pass_rate >= 80 ? "bg-green-500/20 text-green-400 border-green-500/50" :
                        cat.pass_rate >= 60 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                        "bg-red-500/20 text-red-400 border-red-500/50"
                      }>
                        {cat.pass_rate}% Pass Rate
                      </Badge>
                    </div>
                    <div className="text-xs text-white/60 mb-2">{cat.findings_count} findings</div>
                    <div className="text-xs text-white/80">
                      Tests: {cat.tests_performed.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2 flex items-center justify-center gap-2">
                    {auditReport.risk_assessment.overall_risk}
                    {getRiskTrendIcon(auditReport.risk_assessment.risk_trend)}
                  </div>
                  <div className="text-sm text-white/60">Overall Risk Level • {auditReport.risk_assessment.risk_trend}</div>
                  <div className="text-xs text-white/50 mt-1">Time to Remediate: {auditReport.risk_assessment.time_to_remediate}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-500/10 backdrop-blur-md rounded-lg p-4 text-center border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">{auditReport.risk_assessment.technical_risk}/10</div>
                    <div className="text-xs text-white/60 mt-1">Technical</div>
                  </div>
                  <div className="bg-orange-500/10 backdrop-blur-md rounded-lg p-4 text-center border border-orange-500/30">
                    <div className="text-2xl font-bold text-orange-400">{auditReport.risk_assessment.business_risk}/10</div>
                    <div className="text-xs text-white/60 mt-1">Business</div>
                  </div>
                  <div className="bg-yellow-500/10 backdrop-blur-md rounded-lg p-4 text-center border border-yellow-500/30">
                    <div className="text-2xl font-bold text-yellow-400">{auditReport.risk_assessment.compliance_risk}/10</div>
                    <div className="text-xs text-white/60 mt-1">Compliance</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attack Surface */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Attack Surface Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xl font-bold text-white">{auditReport.attack_surface_analysis.external_endpoints}</div>
                  <div className="text-xs text-white/60">External Endpoints</div>
                </div>
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xl font-bold text-white">{auditReport.attack_surface_analysis.api_endpoints}</div>
                  <div className="text-xs text-white/60">API Endpoints</div>
                </div>
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xl font-bold text-white">{auditReport.attack_surface_analysis.authentication_points}</div>
                  <div className="text-xs text-white/60">Auth Points</div>
                </div>
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xl font-bold text-white">{auditReport.attack_surface_analysis.data_stores}</div>
                  <div className="text-xs text-white/60">Data Stores</div>
                </div>
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xl font-bold text-white">{auditReport.attack_surface_analysis.third_party_integrations}</div>
                  <div className="text-xs text-white/60">3rd Party Integrations</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">High-Value Targets</h4>
                <ul className="space-y-1">
                  {auditReport.attack_surface_analysis.high_value_targets.map((target, idx) => (
                    <li key={idx} className="text-sm text-orange-400 flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" />
                      {target}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Positive Findings */}
          {auditReport.positive_findings && auditReport.positive_findings.length > 0 && (
            <Card className="bg-green-500/10 backdrop-blur-md border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Security Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {auditReport.positive_findings.map((finding, idx) => (
                    <li key={idx} className="text-sm text-white flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Security Findings */}
          {auditReport.findings && auditReport.findings.length > 0 && (
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Security Vulnerabilities ({auditReport.findings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditReport.findings.map((finding, idx) => {
                    const colors = getSeverityColor(finding.severity);
                    return (
                      <div key={idx} className={`${colors.bg} backdrop-blur-md border ${colors.border} rounded-lg p-4`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
                              {finding.severity}
                            </Badge>
                            <span className="font-semibold text-white">{finding.title}</span>
                            <Badge className="bg-white/10 text-white border-white/30 text-xs">
                              CVSS {finding.cvss_score}
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/30 text-xs">
                              {finding.cwe_id}
                            </Badge>
                          </div>
                          <Badge className="bg-white/10 text-white border-white/30 text-xs">
                            {finding.id}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-white/60">Component: </span>
                            <span className="text-white font-mono">{finding.affected_component}</span>
                          </div>
                          <p className="text-white">{finding.description}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-white/60">Likelihood: </span>
                              <span className="text-white">{finding.likelihood}</span>
                            </div>
                            <div>
                              <span className="text-white/60">Effort to Fix: </span>
                              <span className="text-white">{finding.effort}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-900/30 backdrop-blur-md rounded p-3 mt-3 mb-2">
                          <div className="text-xs text-orange-400 font-semibold mb-1">Impact:</div>
                          <p className="text-xs text-white">{finding.impact}</p>
                        </div>
                        
                        <div className="bg-blue-900/30 backdrop-blur-md rounded p-3">
                          <div className="text-xs text-green-400 font-semibold mb-1">Recommendation:</div>
                          <p className="text-xs text-white">{finding.recommendation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compliance Status */}
          {auditReport.compliance_status && auditReport.compliance_status.length > 0 && (
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditReport.compliance_status.map((comp, idx) => (
                    <div key={idx} className="bg-blue-900/30 backdrop-blur-md border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{comp.standard}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            comp.status === "Compliant" ? "bg-green-500/20 text-green-400 border-green-500/50" :
                            comp.status === "Partial" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                            "bg-red-500/20 text-red-400 border-red-500/50"
                          }>
                            {comp.status}
                          </Badge>
                          <span className="text-sm text-white">{comp.score}%</span>
                        </div>
                      </div>
                      {comp.gaps.length > 0 && (
                        <div>
                          <div className="text-xs text-white/60 mb-1">Compliance Gaps:</div>
                          <ul className="text-xs text-white space-y-1">
                            {comp.gaps.map((gap, gidx) => (
                              <li key={gidx}>• {gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Plan */}
          {auditReport.action_plan && auditReport.action_plan.length > 0 && (
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Remediation Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditReport.action_plan.map((item, idx) => {
                    const colors = getSeverityColor(item.priority);
                    return (
                      <div key={idx} className={`${colors.bg} backdrop-blur-md rounded-lg p-4 border ${colors.border}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`w-4 h-4 ${colors.text}`} />
                            <span className="font-semibold text-sm text-white">{item.action}</span>
                          </div>
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>{item.priority}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs text-white/60 pl-6">
                          <div>Timeline: <span className="text-white">{item.timeline}</span></div>
                          <div>Owner: <span className="text-white">{item.owner}</span></div>
                          <div>Cost: <span className="text-white">{item.cost}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conclusion */}
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Conclusion & Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white leading-relaxed whitespace-pre-line">{auditReport.conclusion}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}