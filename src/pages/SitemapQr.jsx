import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SitemapQr() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>QR Sitemap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">QR Code generator pages.</p>
          <a href="/api/apps/functions/sitemapQr" className="text-blue-500 hover:underline">View XML</a>
        </CardContent>
      </Card>
    </div>
  );
}