import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SitemapXml() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>XML Sitemap Index</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Main XML sitemap for search engines.</p>
          <a href="/api/apps/functions/sitemapXml" className="text-blue-500 hover:underline">View XML</a>
        </CardContent>
      </Card>
    </div>
  );
}