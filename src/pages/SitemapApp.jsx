import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SitemapApp() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>App Sitemap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Application pages sitemap.</p>
          <a href="/api/apps/functions/sitemapApp" className="text-blue-500 hover:underline">View XML</a>
        </CardContent>
      </Card>
    </div>
  );
}