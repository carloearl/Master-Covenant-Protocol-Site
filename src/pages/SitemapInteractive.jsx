import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SitemapInteractive() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Sitemap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Interactive components sitemap.</p>
          <a href="/api/apps/functions/sitemapInteractive" className="text-blue-500 hover:underline">View XML</a>
        </CardContent>
      </Card>
    </div>
  );
}