import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Archive, Trash2, Download, Eye, 
  Image as ImageIcon, Loader2, Lock, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * QrVaultPanel - Shows permanently saved QR codes
 */
export default function QrVaultPanel({
  vaultedItems = [],
  loading,
  onSelectItem,
  onDeleteItem,
  selectedId
}) {
  const [actionLoading, setActionLoading] = useState(null);

  const handleDelete = async (e, item) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this QR from your vault?')) {
      return;
    }
    setActionLoading(item.id);
    await onDeleteItem(item.id);
    setActionLoading(null);
  };

  const handleDownload = (e, item) => {
    e.stopPropagation();
    if (!item.image_data_url) {
      toast.error('No image available');
      return;
    }
    const link = document.createElement('a');
    link.href = item.image_data_url;
    link.download = `glyphlock-vault-${item.code_id || Date.now()}.png`;
    link.click();
    toast.success('Downloaded from vault');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const truncatePayload = (payload, max = 40) => {
    if (!payload) return '';
    return payload.length > max ? payload.substring(0, max) + '...' : payload;
  };

  if (loading) {
    return (
      <Card className="bg-gray-900/80 border-green-500/30">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-green-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/80 border-green-500/30">
      <CardHeader className="border-b border-green-500/20 pb-3">
        <CardTitle className="text-white text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-400" />
            My Vault
          </span>
          <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
            {vaultedItems.length} Saved
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {vaultedItems.length === 0 ? (
          <div className="p-6 text-center">
            <Archive className="w-10 h-10 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-500 text-sm">Your vault is empty</p>
            <p className="text-gray-600 text-xs mt-1">Save important QR codes here for permanent storage</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px]">
            <div className="p-2 space-y-2">
              {vaultedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={`group p-3 rounded-lg cursor-pointer transition-all border ${
                    selectedId === item.id
                      ? 'bg-green-500/20 border-green-500/50'
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-green-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded bg-gray-700 flex-shrink-0 overflow-hidden border border-green-500/30">
                      {item.image_data_url ? (
                        <img 
                          src={item.image_data_url} 
                          alt="Vaulted QR" 
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
                        <span className="text-xs font-medium text-green-400 uppercase">
                          {item.payload_type || 'url'}
                        </span>
                        <Badge className="text-[8px] px-1 py-0 bg-green-500/20 text-green-400 border-0">
                          Vaulted
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300 truncate mt-0.5">
                        {truncatePayload(item.payload)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <p className="text-[10px] text-gray-500">
                          {formatDate(item.vault_date)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-cyan-400 hover:bg-cyan-500/20"
                        onClick={(e) => handleDownload(e, item)}
                        title="Download"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-red-400 hover:bg-red-500/20"
                        onClick={(e) => handleDelete(e, item)}
                        disabled={actionLoading === item.id}
                        title="Delete from Vault"
                      >
                        {actionLoading === item.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
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

export { QrVaultPanel };