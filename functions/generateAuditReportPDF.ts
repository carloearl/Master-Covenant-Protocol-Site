/**
 * GENERATE AUDIT REPORT PDF
 * Creates comprehensive PDF reports from audit findings with customization options
 * Uses jsPDF for PDF generation, stores in FileStorage
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { jsPDF } from 'npm:jspdf@2.5.1';

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getRiskColor = (severity) => {
  const colors = {
    critical: [220, 38, 38],
    high: [249, 115, 22],
    medium: [234, 179, 8],
    low: [34, 197, 94]
  };
  return colors[severity] || [107, 114, 128];
};

const generatePDF = (auditData, options = {}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margins = { top: 15, left: 15, right: 15, bottom: 15 };
  let yPos = margins.top;

  // Helper: Add page break if needed
  const checkPageBreak = (neededSpace) => {
    if (yPos + neededSpace > pageHeight - margins.bottom) {
      doc.addPage();
      yPos = margins.top;
      return true;
    }
    return false;
  };

  // Title Page
  doc.setFontSize(24);
  doc.setTextColor(30, 58, 138); // Royal blue
  doc.text('SECURITY AUDIT REPORT', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`${auditData.title || 'Untitled Audit'}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 20;

  // Summary Box
  const summaryX = margins.left;
  const summaryWidth = pageWidth - margins.left - margins.right;
  doc.setDrawColor(87, 61, 255);
  doc.setLineWidth(1);
  doc.rect(summaryX, yPos, summaryWidth, 40);

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('AUDIT SUMMARY', summaryX + 5, yPos + 7);

  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const summary = auditData.summary || {};
  yPos += 12;
  doc.text(`Total Findings: ${summary.totalFindings || 0}`, summaryX + 5, yPos);
  yPos += 6;
  doc.text(`Overall Risk Score: ${summary.overallRiskScore || 0}/100`, summaryX + 5, yPos);
  yPos += 6;
  doc.text(`Report Date: ${formatDate(auditData.reportDate)}`, summaryX + 5, yPos);
  yPos += 24;

  // Severity Stats
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Severity Breakdown', margins.left, yPos);
  yPos += 8;

  const severities = [
    { label: 'Critical', count: summary.criticalCount || 0, color: getRiskColor('critical') },
    { label: 'High', count: summary.highCount || 0, color: getRiskColor('high') },
    { label: 'Medium', count: summary.mediumCount || 0, color: getRiskColor('medium') },
    { label: 'Low', count: summary.lowCount || 0, color: getRiskColor('low') }
  ];

  let statX = margins.left;
  doc.setFontSize(10);
  for (const severity of severities) {
    const [r, g, b] = severity.color;
    doc.setFillColor(r, g, b);
    doc.rect(statX, yPos, 8, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(`${severity.label}: ${severity.count}`, statX + 12, yPos + 6);
    statX += 50;
  }
  yPos += 15;

  // Page break before findings
  checkPageBreak(50);

  // Findings Section
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text('DETAILED FINDINGS', margins.left, yPos);
  yPos += 10;

  const findings = auditData.findings || [];
  const filteredFindings = findings.filter(f => 
    !options.severityFilter || options.severityFilter.includes(f.severity)
  );

  if (filteredFindings.length === 0) {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text('No findings match the selected filters.', margins.left, yPos);
    yPos += 10;
  } else {
    for (let i = 0; i < filteredFindings.length; i++) {
      checkPageBreak(35);

      const finding = filteredFindings[i];
      
      // Finding header with severity badge
      const [r, g, b] = getRiskColor(finding.severity);
      doc.setFillColor(r, g, b);
      doc.rect(margins.left, yPos, 12, 10, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(finding.severity.toUpperCase(), margins.left + 2, yPos + 7);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`${i + 1}. ${finding.title}`, margins.left + 15, yPos + 7);
      yPos += 12;

      // Finding details
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      
      doc.text('Description:', margins.left, yPos);
      yPos += 4;
      const descLines = doc.splitTextToSize(finding.description || 'N/A', pageWidth - margins.left - margins.right - 10);
      doc.text(descLines, margins.left + 5, yPos);
      yPos += descLines.length * 4 + 2;

      doc.text('Remediation:', margins.left, yPos);
      yPos += 4;
      const remLines = doc.splitTextToSize(finding.remediation || 'N/A', pageWidth - margins.left - margins.right - 10);
      doc.text(remLines, margins.left + 5, yPos);
      yPos += remLines.length * 4 + 5;

      if (finding.riskScore !== undefined) {
        doc.setTextColor(100, 100, 100);
        doc.text(`Risk Score: ${finding.riskScore}/100`, margins.left, yPos);
        yPos += 6;
      }

      yPos += 2;
    }
  }

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  return doc.output('arraybuffer');
};

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title = 'Security Audit Report',
      auditId,
      auditType,
      summary = {},
      findings = [],
      reportDate = new Date().toISOString(),
      dateRange = {},
      severityFilter = ['critical', 'high', 'medium', 'low']
    } = body;

    if (!auditType || !summary) {
      return Response.json(
        { error: 'Missing required fields: auditType, summary' },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfBuffer = generatePDF(
      { title, auditId, auditType, summary, findings, reportDate, dateRange },
      { severityFilter }
    );

    // Upload PDF to FileStorage
    const fileName = `audit-report-${Date.now()}.pdf`;
    
    const reportRecord = await base44.entities.AuditReport.create({
      title,
      auditId,
      auditType,
      reportDate,
      dateRange,
      severityFilter,
      summary,
      findings: findings.filter(f => severityFilter.includes(f.severity)),
      status: 'completed',
      fileSize: pdfBuffer.byteLength
    });

    // Create a data URL for download (frontend will handle actual storage)
    const base64Pdf = btoa(String.fromCharCode.apply(null, new Uint8Array(pdfBuffer)));
    const dataUrl = `data:application/pdf;base64,${base64Pdf}`;

    return Response.json({
      success: true,
      reportId: reportRecord.id,
      fileName,
      dataUrl,
      fileSize: pdfBuffer.byteLength,
      message: 'PDF generated successfully'
    });

  } catch (error) {
    console.error('[generateAuditReportPDF] Error:', error);
    return Response.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
});