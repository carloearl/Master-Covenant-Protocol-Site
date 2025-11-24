import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function QrStegoArtBuilder({ qrAssetDraft, onEmbedded }) {
  const [coverFileUri, setCoverFileUri] = useState('');
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');
  const [mode, setMode] = useState('standardDisguised');
  const [hiddenPayload, setHiddenPayload] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [disguisedResult, setDisguisedResult] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setCoverFileUri(file_url);
      setCoverPreviewUrl(URL.createObjectURL(file));
      toast.success('Cover image uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBuild = async () => {
    if (!coverFileUri || !qrAssetDraft) {
      toast.error('Cover image and QR asset required');
      return;
    }

    if (mode === 'dualLayerDisguised' && !hiddenPayload) {
      toast.error('Hidden payload required for dual layer mode');
      return;
    }

    setIsEmbedding(true);
    try {
      const result = await base44.functions.invoke('buildStegoDisguisedImage', {
        cover_file_uri: coverFileUri,
        qrAssetId: qrAssetDraft.id,
        mode,
        hiddenPayload: mode === 'dualLayerDisguised' ? hiddenPayload : undefined
      });

      setDisguisedResult({
        disguisedImageUrl: result.data.disguisedImageUrl,
        mode: result.data.mode
      });

      onEmbedded(result.data.disguisedImageUrl, result.data.mode);
      toast.success('Disguised QR image created!');
    } catch (error) {
      toast.error(error.message || 'Embedding failed');
    } finally {
      setIsEmbedding(false);
    }
  };

  return (
    <Card className="w-full bg-gray-900/50 border-gray-800 shadow-xl">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-white text-lg lg:text-xl">Stego Disguised Art Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Upload Cover Image */}
        <div className="space-y-3">
          <Label htmlFor="coverImage" className="text-gray-300 text-base">
            Cover Image
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id="coverImage"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="min-h-[48px] text-base bg-gray-800 border-gray-700"
            />
            {isUploading && <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />}
          </div>
          {coverPreviewUrl && (
            <div className="mt-4">
              <img
                src={coverPreviewUrl}
                alt="Cover preview"
                className="w-full max-w-md mx-auto lg:mx-0 rounded-lg border-2 border-gray-700 shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Mode Selection */}
        <div className="space-y-3">
          <Label htmlFor="stegoMode" className="text-gray-300 text-base">Stego Mode</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger id="stegoMode" className="min-h-[48px] text-base bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standardDisguised">
                Standard Disguised (Any scanner reads base payload)
              </SelectItem>
              <SelectItem value="dualLayerDisguised">
                Dual Layer Disguised (GlyphLock reads hidden layer)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hidden Payload for Dual Layer */}
        {mode === 'dualLayerDisguised' && (
          <div className="space-y-3">
            <Label htmlFor="hiddenPayload" className="text-gray-300 text-base">
              Hidden Payload (GlyphLock Only)
            </Label>
            <Textarea
              id="hiddenPayload"
              value={hiddenPayload}
              onChange={(e) => setHiddenPayload(e.target.value)}
              placeholder="Secret data only GlyphLock scanner can read"
              className="min-h-[100px] text-base bg-gray-800 border-gray-700"
            />
          </div>
        )}

        {/* Build Button */}
        <Button
          onClick={handleBuild}
          disabled={isEmbedding || !coverFileUri || !qrAssetDraft}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 min-h-[52px] text-base font-semibold shadow-lg shadow-purple-500/30"
        >
          {isEmbedding ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Embedding QR...
            </>
          ) : (
            <>
              <ImageIcon className="w-5 h-5 mr-2" />
              Build Disguised Image
            </>
          )}
        </Button>

        {/* Result Preview */}
        {disguisedResult && (
          <div className="space-y-6 pt-6 border-t border-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-gray-300 text-base font-semibold">Before (Cover)</Label>
                <img
                  src={coverPreviewUrl}
                  alt="Before"
                  className="w-full rounded-lg border-2 border-gray-700 shadow-lg"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-300 text-base font-semibold">After (Disguised QR)</Label>
                <img
                  src={disguisedResult.disguisedImageUrl}
                  alt="After"
                  className="w-full rounded-lg border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                />
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <strong>Regular Scanners:</strong> Can read the base payload: "{qrAssetDraft.title || 'QR payload'}"
                  </p>
                  {mode === 'dualLayerDisguised' && (
                    <p>
                      <strong>GlyphLock Scanner:</strong> Additionally extracts the hidden layer: "{hiddenPayload}"
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    The QR code is embedded using adaptive luminance modulation while preserving finder patterns and quiet zones for universal scannability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}