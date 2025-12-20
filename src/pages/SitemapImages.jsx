import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SitemapImages() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Image Sitemap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Image resources sitemap.</p>
          <a href="/api/apps/functions/sitemapImages" className="text-blue-500 hover:underline">View XML</a>
        </CardContent>
      </Card>
    </div>
  );
}