import React from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Terminal, Key, Globe, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function DeveloperAPI() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              GlyphLock Developer API
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl">
            Programmatically generate secure, artistic QR codes and retrieve analytics using our robust REST API.
          </p>
        </div>

        {/* Authentication Section */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-yellow-400" />
              Authentication
            </CardTitle>
            <CardDescription className="text-slate-400">
              All API requests require an API Key passed in the header.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-black/50 p-4 rounded-lg border border-slate-800 font-mono text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500">Header Format</span>
              </div>
              <code className="text-green-400">x-api-key: YOUR_PUBLIC_API_KEY</code>
            </div>
            <Button className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 border border-yellow-600/50">
              Generate New API Key
            </Button>
          </CardContent>
        </Card>

        {/* Endpoints Documentation */}
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="generate">Generate QR</TabsTrigger>
            <TabsTrigger value="analytics">Get Analytics</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          {/* GENERATE ENDPOINT */}
          <TabsContent value="generate" className="mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">Create QR Code</CardTitle>
                    <CardDescription className="text-slate-400 mt-2">
                      Generate a new QR asset with custom payload and design configuration.
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">POST</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-mono bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-cyan-400">POST</span>
                  <span className="text-slate-300">https://glyphlock.io/api/v1/createQr</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Request Body</h4>
                  <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
{`{
  "name": "Marketing Campaign Q1",
  "payload": "https://example.com/promo",
  "type": "url",
  "design": {
    "dotStyle": "rounded",
    "eyeStyle": "circle",
    "color": "#3B82F6"
  }
}`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Response</h4>
                  <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-green-300 overflow-x-auto border border-slate-800">
{`{
  "success": true,
  "data": {
    "id": "qr_123456789",
    "url": "https://glyphlock.io/r/qr_123456789",
    "imageUrl": "data:image/png;base64,..."
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANALYTICS ENDPOINT */}
          <TabsContent value="analytics" className="mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">Retrieve Analytics</CardTitle>
                    <CardDescription className="text-slate-400 mt-2">
                      Get scan metrics, geolocation data, and device stats for a QR code.
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">GET</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-mono bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-blue-400">GET</span>
                  <span className="text-slate-300">https://glyphlock.io/api/v1/getQrStats?code_id=qr_12345</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Response</h4>
                  <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-green-300 overflow-x-auto border border-slate-800">
{`{
  "success": true,
  "data": {
    "total_scans": 1450,
    "unique_devices": 1200,
    "top_locations": {
      "US": 800,
      "DE": 200
    },
    "last_scan": "2024-03-15T10:30:00Z"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WEBHOOKS */}
          <TabsContent value="webhooks" className="mt-6">
             <Card className="bg-slate-900 border-slate-800">
               <CardContent className="p-8 text-center">
                 <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                 <h3 className="text-lg font-medium text-white">Webhooks Coming Soon</h3>
                 <p className="text-slate-400 mt-2">Real-time event notifications for scans and security alerts.</p>
               </CardContent>
             </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}