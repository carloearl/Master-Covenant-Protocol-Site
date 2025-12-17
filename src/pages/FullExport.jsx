import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Copy, FileCode, Database, Server, Layout, Check, Loader2, FolderOpen, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';

/**
 * FULL PROJECT EXPORT - INDEPENDENCE FROM BASE44 CREDITS
 * 
 * This page exports your ENTIRE codebase so you can:
 * 1. Host it yourself on Vercel/Netlify/your own server
 * 2. Edit it locally with VS Code (no AI needed)
 * 3. Never lose your work if credits run out
 */

export default function FullExport() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportData, setExportData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const u = await base44.auth.me();
          setUser(u);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleExport = async () => {
    if (!user || user.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }

    setExporting(true);
    try {
      // Call the export function
      const { data } = await base44.functions.invoke('fullProjectExport', {});
      
      if (data.error) {
        throw new Error(data.error);
      }

      setExportData(data);
      toast.success(`Exported ${data.stats.totalFiles} files!`);
    } catch (error) {
      toast.error('Export failed: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const downloadJSON = () => {
    if (!exportData) return;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glyphlock-full-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON export downloaded!');
  };

  const downloadReadable = () => {
    if (!exportData) return;
    
    let content = `# GLYPHLOCK FULL CODEBASE EXPORT\n`;
    content += `# Exported: ${exportData.exportedAt}\n`;
    content += `# By: ${exportData.exportedBy}\n`;
    content += `# Total Files: ${exportData.stats.totalFiles}\n\n`;
    content += `${'='.repeat(80)}\n\n`;
    content += exportData.readme + '\n\n';
    content += `${'='.repeat(80)}\n\n`;

    // Pages
    content += `# PAGES (${exportData.files.pages?.length || 0})\n`;
    content += `${'─'.repeat(80)}\n\n`;
    for (const file of (exportData.files.pages || [])) {
      content += `## FILE: ${file.path}\n`;
      content += `${'─'.repeat(60)}\n\n`;
      content += file.content + '\n\n';
      content += `${'='.repeat(80)}\n\n`;
    }

    // Components
    content += `# COMPONENTS (${exportData.files.components?.length || 0})\n`;
    content += `${'─'.repeat(80)}\n\n`;
    for (const file of (exportData.files.components || [])) {
      content += `## FILE: ${file.path}\n`;
      content += `${'─'.repeat(60)}\n\n`;
      content += file.content + '\n\n';
      content += `${'='.repeat(80)}\n\n`;
    }

    // Entities
    content += `# ENTITIES (${exportData.files.entities?.length || 0})\n`;
    content += `${'─'.repeat(80)}\n\n`;
    for (const file of (exportData.files.entities || [])) {
      content += `## FILE: ${file.path}\n`;
      content += `${'─'.repeat(60)}\n\n`;
      content += file.content + '\n\n';
      content += `${'='.repeat(80)}\n\n`;
    }

    // Functions
    content += `# BACKEND FUNCTIONS (${exportData.files.functions?.length || 0})\n`;
    content += `${'─'.repeat(80)}\n\n`;
    for (const file of (exportData.files.functions || [])) {
      content += `## FILE: ${file.path}\n`;
      content += `${'─'.repeat(60)}\n\n`;
      content += file.content + '\n\n';
      content += `${'='.repeat(80)}\n\n`;
    }

    // Layout
    if (exportData.files.layout) {
      content += `# LAYOUT\n`;
      content += `${'─'.repeat(80)}\n\n`;
      content += `## FILE: Layout.js\n`;
      content += `${'─'.repeat(60)}\n\n`;
      content += exportData.files.layout + '\n\n';
    }

    // Globals CSS
    if (exportData.files.globals) {
      content += `# GLOBAL STYLES\n`;
      content += `${'─'.repeat(80)}\n\n`;
      content += `## FILE: globals.css\n`;
      content += `${'─'.repeat(60)}\n\n`;
      content += exportData.files.globals + '\n\n';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glyphlock-codebase-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Readable export downloaded!');
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="bg-red-950/50 border-red-500/30 max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Admin Access Required</h2>
            <p className="text-red-300">Only administrators can export the full codebase.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'transparent' }}>
      <SEOHead title="Full Export | GlyphLock" />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Full Codebase Export
          </h1>
          <p className="text-xl text-blue-300 max-w-2xl mx-auto">
            Download your entire GlyphLock project. Own your code forever. No credits needed to edit offline.
          </p>
        </div>

        {/* Warning Card */}
        <Card className="bg-yellow-950/30 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-yellow-300 mb-2">Why Export?</h3>
                <ul className="text-yellow-200 space-y-1 text-sm">
                  <li>• Base44 requires credits to edit code through their AI</li>
                  <li>• Without credits, you can only delete files (not edit)</li>
                  <li>• Export gives you full ownership - edit locally with VS Code</li>
                  <li>• Host on Vercel, Netlify, or your own server</li>
                  <li>• This is YOUR code - take it with you</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Button */}
        {!exportData && (
          <Card className="bg-white/5 border-blue-500/30">
            <CardContent className="p-8 text-center">
              <Button
                onClick={handleExport}
                disabled={exporting}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xl px-12 py-6 h-auto"
              >
                {exporting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-3" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6 mr-3" />
                    Export Full Codebase
                  </>
                )}
              </Button>
              <p className="text-slate-400 mt-4">
                This will gather all pages, components, entities, functions, layout, and styles.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Export Results */}
        {exportData && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardContent className="p-4 text-center">
                  <FileCode className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{exportData.stats.pages}</p>
                  <p className="text-xs text-blue-300">Pages</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-950/30 border-purple-500/30">
                <CardContent className="p-4 text-center">
                  <FolderOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{exportData.stats.components}</p>
                  <p className="text-xs text-purple-300">Components</p>
                </CardContent>
              </Card>
              <Card className="bg-green-950/30 border-green-500/30">
                <CardContent className="p-4 text-center">
                  <Database className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{exportData.stats.entities}</p>
                  <p className="text-xs text-green-300">Entities</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-950/30 border-orange-500/30">
                <CardContent className="p-4 text-center">
                  <Server className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{exportData.stats.functions}</p>
                  <p className="text-xs text-orange-300">Functions</p>
                </CardContent>
              </Card>
              <Card className="bg-cyan-950/30 border-cyan-500/30">
                <CardContent className="p-4 text-center">
                  <Layout className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{exportData.stats.totalFiles}</p>
                  <p className="text-xs text-cyan-300">Total Files</p>
                </CardContent>
              </Card>
            </div>

            {/* Download Buttons */}
            <Card className="bg-green-950/30 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Check className="w-6 h-6 text-green-400" />
                  Export Ready!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={downloadJSON}
                    className="bg-blue-600 hover:bg-blue-700 h-16"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download JSON (Structured)
                  </Button>
                  <Button
                    onClick={downloadReadable}
                    className="bg-purple-600 hover:bg-purple-700 h-16"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download TXT (Readable)
                  </Button>
                </div>
                <p className="text-sm text-slate-400">
                  JSON format is best for programmatic access. TXT format is human-readable with all code inline.
                </p>
              </CardContent>
            </Card>

            {/* Quick Copy Section */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Copy Individual Files</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {exportData.files.pages?.map((file) => (
                      <div key={file.path} className="flex items-center justify-between p-3 bg-blue-950/30 rounded-lg">
                        <span className="text-sm text-blue-300 font-mono">{file.path}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(file.content, file.path)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {exportData.files.components?.map((file) => (
                      <div key={file.path} className="flex items-center justify-between p-3 bg-purple-950/30 rounded-lg">
                        <span className="text-sm text-purple-300 font-mono">{file.path}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(file.content, file.path)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {exportData.files.entities?.map((file) => (
                      <div key={file.path} className="flex items-center justify-between p-3 bg-green-950/30 rounded-lg">
                        <span className="text-sm text-green-300 font-mono">{file.path}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(file.content, file.path)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {exportData.files.functions?.map((file) => (
                      <div key={file.path} className="flex items-center justify-between p-3 bg-orange-950/30 rounded-lg">
                        <span className="text-sm text-orange-300 font-mono">{file.path}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(file.content, file.path)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* README Preview */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Setup Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-green-400 bg-black/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                  {exportData.readme}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}