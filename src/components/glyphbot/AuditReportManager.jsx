import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Loader2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

export default function AuditReportManager({ auditData, onClose }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [user, setUser] = useState(null);

  // Report customization state
  const [reportTitle, setReportTitle] = useState(auditData?.title || 'Security Audit Report');
  const [dateRange, setDateRange] = useState({
    startDate: auditData?.startDate || '',
    endDate: auditData?.endDate || new Date().toISOString().split('T')[0]
  });
  const [severityFilter, setSeverityFilter] = useState({
    critical: true,
    high: true,
    medium: true,
    low: true
  });

  // Load user and existing reports
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);

        const existingReports = await base44.entities.AuditReport.filter({
          created_by: userData.email,
          auditType: auditData?.auditType || 'custom'
        });
        setReports(existingReports);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    loadData();
  }, [auditData?.auditType]);

  const handleSeverityChange = (severity) => {
    setSeverityFilter(prev => ({
      ...prev,
      [severity]: !prev[severity]
    }));
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      const selectedSeverities = Object.keys(severityFilter).filter(k => severityFilter[k]);

      if (selectedSeverities.length === 0) {
        alert('Please select at least one severity level');
        setGenerating(false);
        return;
      }

      const response = await base44.functions.invoke('generateAuditReportPDF', {
        title: reportTitle,
        auditId: auditData?.id,
        auditType: auditData?.auditType || 'custom',
        summary: auditData?.summary || {},
        findings: auditData?.findings || [],
        reportDate: new Date().toISOString(),
        dateRange,
        severityFilter: selectedSeverities
      });

      if (response.data.success) {
        // Download PDF
        const link = document.createElement('a');
        link.href = response.data.dataUrl;
        link.download = response.data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Refresh reports list
        const updatedReports = await base44.entities.AuditReport.filter({
          created_by: user.email,
          auditType: auditData?.auditType || 'custom'
        });
        setReports(updatedReports);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const deleteReport = async (reportId) => {
    if (!confirm('Delete this report permanently?')) return;

    try {
      await base44.entities.AuditReport.delete(reportId);
      setReports(reports.filter(r => r.id !== reportId));
    } catch (err) {
      console.error('Failed to delete report:', err);
      alert('Failed to delete report');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Generate Audit Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Customization */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Report Title</label>
              <Input
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter report title"
                className="bg-slate-800 border-slate-600"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Include Findings by Severity</label>
              <div className="space-y-2">
                {['critical', 'high', 'medium', 'low'].map(severity => (
                  <label key={severity} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={severityFilter[severity]}
                      onCheckedChange={() => handleSeverityChange(severity)}
                    />
                    <span className="capitalize text-gray-300">{severity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateReport}
            disabled={generating}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate & Download PDF
              </>
            )}
          </Button>

          {/* Recent Reports */}
          {reports.length > 0 && (
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Recent Reports</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {reports.slice(0, 5).map(report => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {report.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : report.status === 'failed' ? (
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      ) : (
                        <Loader2 className="w-4 h-4 text-cyan-500 animate-spin flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">{report.title}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(report.created_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteReport(report.id)}
                      className="text-red-400 hover:text-red-300 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-slate-600 text-gray-300"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}