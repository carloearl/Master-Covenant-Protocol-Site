import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, Trash2, Clock, ChevronRight, Archive, 
  Image as ImageIcon, ExternalLink, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * QrPreviewSidebar - Shows saved previews with click-to-load
 */
export default function QrPreviewSidebar({
  previews = [],
  loading,
  onSelectPreview,
  onSaveToVault,
  onDeletePreview,
  selectedId,
  previewCount,
  maxPreviews
}) {
  const [actionLoading, setActionLoading] = useState(null);

  const handleVault = async (e, preview) => {
    e.stopPropagation();
    setActionLoading(preview.id);
    await onSaveToVault(preview.id);
    setActionLoading(null);
  };

  const handleDelete = async (e, preview) => {
    e.stopPropagation();
    setActionLoading(preview.id);
    await onDeletePreview(preview.id);
    setActionLoading(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const truncatePayload = (payload, max = 30) => {
    if (!payload) return '';
    return payload.length > max ? payload.substring(0, max) + '...' : payload;
  };

  if (loading) {
    return (
      <Card className="bg-gray-900/80 border-purple-500/30">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/80 border-purple-500/30">
      <CardHeader className="border-b border-purple-500/20 pb-3">
        <CardTitle className="text-white text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Recent Previews
          </span>
          <Badge 
            variant="outline" 
            className={`text-xs ${previewCount >= maxPreviews ? 'border-orange-500/50 text-orange-400' : 'border-cyan-500/50 text-cyan-400'}`}
          >
            {previewCount}/{maxPreviews}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {previews.length === 0 ? (
          <div className="p-6 text-center">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-500 text-sm">No previews yet</p>
            <p className="text-gray-600 text-xs mt-1">Generate a QR to auto-save</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="p-2 space-y-2">
              {previews.map((preview) => (
                <div
                  key={preview.id}
                  onClick={() => onSelectPreview(preview)}
                  className={`group p-3 rounded-lg cursor-pointer transition-all border ${
                    selectedId === preview.id
                      ? 'bg-cyan-500/20 border-cyan-500/50'
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded bg-gray-700 flex-shrink-0 overflow-hidden">
                      {preview.image_data_url ? (
                        <img 
                          src={preview.image_data_url} 
                          alt="QR Preview" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-purple-400 uppercase">
                          {preview.payload_type || 'url'}
                        </span>
                        {preview.risk_score <= 20 && (
                          <Badge className="text-[8px] px-1 py-0 bg-green-500/20 text-green-400 border-0">
                            Safe
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-300 truncate mt-0.5">
                        {truncatePayload(preview.payload)}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {formatDate(preview.created_date)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-cyan-400 hover:bg-cyan-500/20"
                        onClick={(e) => handleVault(e, preview)}
                        disabled={actionLoading === preview.id}
                        title="Save to Vault"
                      >
                        {actionLoading === preview.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Archive className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-red-400 hover:bg-red-500/20"
                        onClick={(e) => handleDelete(e, preview)}
                        disabled={actionLoading === preview.id}
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export { QrPreviewSidebar };