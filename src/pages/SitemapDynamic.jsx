import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SitemapDynamic() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Sitemap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Dynamic content sitemap.</p>
          <a href="/api/apps/functions/sitemapDynamic" className="text-blue-500 hover:underline">View XML</a>
        </CardContent>
      </Card>
    </div>
  );
}