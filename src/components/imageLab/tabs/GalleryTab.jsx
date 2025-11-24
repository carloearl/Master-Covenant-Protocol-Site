import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2, Search, Download, Edit, Trash2, Eye, Lock, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  GlyphImageCard,
  GlyphImageButton,
  GlyphImageInput,
  GlyphImageTypography,
  GlyphImageBadge,
  GlyphImagePanel,
} from '../design/GlyphImageDesignSystem';

export default function GalleryTab({ user, onImageSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const { data: images = [], isLoading, refetch } = useQuery({
    queryKey: ['interactive-images'],
    queryFn: async () => {
      const result = await base44.entities.InteractiveImage.list('-created_date', 100);
      return result;
    },
    initialData: [],
  });

  const filteredImages = images.filter((img) => {
    const matchesSearch =
      !searchQuery ||
      img.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.prompt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || img.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || img.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await base44.entities.InteractiveImage.delete(imageId);
      toast.success('Image deleted');
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleDownload = async (url, name) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${name || 'image'}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
      toast.success('Downloaded image');
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className={GlyphImageCard.glass}>
        <CardContent className={GlyphImagePanel.compact}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className={`${GlyphImageInput.base} pl-11`}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={GlyphImageInput.base}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className={GlyphImageInput.base}>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="generated">Generated</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
        </div>
      ) : filteredImages.length === 0 ? (
        <Card className={`${GlyphImageCard.glass} p-12 text-center`}>
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-lg">
            {searchQuery || statusFilter !== 'all' || sourceFilter !== 'all'
              ? 'No images match your filters'
              : 'No images yet. Generate or upload images to get started.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id} className={`${GlyphImageCard.premium} group hover:shadow-2xl transition-all`}>
              <CardHeader className="p-0">
                <div className="relative aspect-video overflow-hidden rounded-t-xl">
                  <img
                    src={image.fileUrl}
                    alt={image.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {image.status === 'active' && (
                      <div className={GlyphImageBadge.success}>
                        <Lock className="w-3 h-3" />
                      </div>
                    )}
                    {image.source === 'generated' && (
                      <div className={GlyphImageBadge.info}>AI</div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="text-white font-semibold truncate">{image.name}</h3>
                  {image.prompt && (
                    <p className="text-xs text-gray-400 truncate">{image.prompt}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{new Date(image.created_date).toLocaleDateString()}</span>
                    {image.hotspots?.length > 0 && (
                      <span>• {image.hotspots.length} hotspots</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    onClick={() => onImageSelect(image)}
                    className={GlyphImageButton.secondary}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(image.fileUrl, image.name)}
                    className={GlyphImageButton.ghost}
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    className={GlyphImageButton.danger}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}