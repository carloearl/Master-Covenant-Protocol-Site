import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Square, Save, Lock, Trash2, Hand } from 'lucide-react';
import { toast } from 'sonner';
import {
  GlyphImageCard,
  GlyphImageButton,
  GlyphImageInput,
  GlyphImageTypography,
  GlyphImageShadows,
  GlyphImageBadge,
  GlyphImagePanel,
} from '../design/GlyphImageDesignSystem';

export default function InteractiveTab({ user, selectedImage, onImageSelect }) {
  const [imageAsset, setImageAsset] = useState(selectedImage);
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setImageAsset(selectedImage);
      setHotspots(selectedImage.hotspots || []);
    }
  }, [selectedImage]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const uploadResult = await base44.integrations.Core.UploadFile({ file });

      const image = await base44.entities.InteractiveImage.create({
        name: file.name,
        fileUrl: uploadResult.file_url,
        source: 'uploaded',
        status: 'draft',
        ownerEmail: user.email,
      });

      setImageAsset(image);
      setHotspots([]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleCanvasMouseDown = (e) => {
    if (activeTool !== 'rectangle') return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDrawing(true);
    setDrawStart({ x, y });
  };

  const handleCanvasMouseUp = (e) => {
    if (!isDrawing || activeTool !== 'rectangle' || !drawStart) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newHotspot = {
      id: Date.now().toString(),
      x: Math.min(drawStart.x, x),
      y: Math.min(drawStart.y, y),
      width: Math.abs(x - drawStart.x),
      height: Math.abs(y - drawStart.y),
      shape: 'rect',
      label: `Hotspot ${hotspots.length + 1}`,
      description: '',
      actionType: 'openUrl',
      actionValue: '',
    };

    setHotspots([...hotspots, newHotspot]);
    setSelectedHotspot(newHotspot);
    setIsDrawing(false);
    setDrawStart(null);
    setActiveTool('select');
    toast.success('Hotspot created');
  };

  const handleUpdateHotspot = (field, value) => {
    if (!selectedHotspot) return;

    const updated = { ...selectedHotspot, [field]: value };
    setSelectedHotspot(updated);
    setHotspots(hotspots.map((h) => (h.id === updated.id ? updated : h)));
  };

  const handleDeleteHotspot = () => {
    if (!selectedHotspot) return;

    setHotspots(hotspots.filter((h) => h.id !== selectedHotspot.id));
    setSelectedHotspot(null);
    toast.success('Hotspot deleted');
  };

  const handleSave = async () => {
    if (!imageAsset) return;

    try {
      setLoading(true);

      await base44.entities.InteractiveImage.update(imageAsset.id, {
        hotspots,
      });

      toast.success('Hotspots saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save hotspots');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!imageAsset) return;

    try {
      setLoading(true);

      // Compute hash via backend
      const response = await base44.functions.invoke('finalizeInteractiveImage', {
        imageId: imageAsset.id,
      });

      if (response.data.success) {
        await base44.entities.InteractiveImage.update(imageAsset.id, {
          status: 'active',
          immutableHash: response.data.hash,
          imageFileHash: response.data.imageFileHash,
        });

        toast.success('Image finalized and cryptographically secured!');
        setImageAsset({ ...imageAsset, status: 'active', immutableHash: response.data.hash });
      }
    } catch (error) {
      console.error('Finalize error:', error);
      toast.error('Failed to finalize image');
    } finally {
      setLoading(false);
    }
  };

  if (!imageAsset) {
    return (
      <Card className={`${GlyphImageCard.glass} p-12 text-center`}>
        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <p className="text-gray-400 text-lg mb-4">Upload an image or select from Gallery to add hotspots</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button onClick={() => document.getElementById('image-upload').click()} className={GlyphImageButton.secondary}>
            <Upload className="w-5 h-5 mr-2" />
            Upload Image
          </Button>
        </label>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left - Toolbar */}
      <div className="lg:col-span-1 space-y-6">
        <Card className={`${GlyphImageCard.premium}`}>
          <CardHeader className="border-b border-purple-500/20">
            <CardTitle className={`${GlyphImageTypography.heading.md} text-white`}>Tools</CardTitle>
          </CardHeader>
          <CardContent className={GlyphImagePanel.compact}>
            <div className="space-y-2">
              <Button
                onClick={() => setActiveTool('select')}
                className={`w-full justify-start ${
                  activeTool === 'select' ? GlyphImageButton.primary : GlyphImageButton.ghost
                }`}
              >
                <Hand className="w-4 h-4 mr-2" />
                Select
              </Button>
              <Button
                onClick={() => setActiveTool('rectangle')}
                className={`w-full justify-start ${
                  activeTool === 'rectangle' ? GlyphImageButton.primary : GlyphImageButton.ghost
                }`}
              >
                <Square className="w-4 h-4 mr-2" />
                Draw Rectangle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hotspot Properties */}
        {selectedHotspot && (
          <Card className={`${GlyphImageCard.premium}`}>
            <CardHeader className="border-b border-purple-500/20">
              <CardTitle className={`${GlyphImageTypography.heading.md} text-white`}>Hotspot Properties</CardTitle>
            </CardHeader>
            <CardContent className={GlyphImagePanel.compact}>
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-300">Label</Label>
                  <Input
                    value={selectedHotspot.label}
                    onChange={(e) => handleUpdateHotspot('label', e.target.value)}
                    className={GlyphImageInput.base}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Description</Label>
                  <Textarea
                    value={selectedHotspot.description}
                    onChange={(e) => handleUpdateHotspot('description', e.target.value)}
                    className={GlyphImageInput.base}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Action Type</Label>
                  <Select
                    value={selectedHotspot.actionType}
                    onValueChange={(val) => handleUpdateHotspot('actionType', val)}
                  >
                    <SelectTrigger className={GlyphImageInput.base}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openUrl">Open URL</SelectItem>
                      <SelectItem value="playAudio">Play Audio</SelectItem>
                      <SelectItem value="showModal">Show Modal</SelectItem>
                      <SelectItem value="invokeAgent">Invoke Agent</SelectItem>
                      <SelectItem value="verifyAccess">Verify Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Action Value</Label>
                  <Input
                    value={selectedHotspot.actionValue}
                    onChange={(e) => handleUpdateHotspot('actionValue', e.target.value)}
                    placeholder="https://example.com"
                    className={GlyphImageInput.base}
                  />
                </div>
                <Button onClick={handleDeleteHotspot} className={`${GlyphImageButton.danger} w-full`}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Hotspot
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className={`${GlyphImageCard.glass}`}>
          <CardContent className={GlyphImagePanel.compact}>
            <div className="space-y-2">
              <Button
                onClick={handleSave}
                disabled={loading || imageAsset?.status === 'active'}
                className={`${GlyphImageButton.secondary} w-full`}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Hotspots
              </Button>
              <Button
                onClick={handleFinalize}
                disabled={loading || imageAsset?.status === 'active' || hotspots.length === 0}
                className={`${GlyphImageButton.primary} w-full ${GlyphImageShadows.neonCyan}`}
              >
                <Lock className="w-4 h-4 mr-2" />
                {imageAsset?.status === 'active' ? 'Finalized' : 'Finalize & Lock'}
              </Button>
            </div>
            {imageAsset?.status === 'active' && (
              <div className={`mt-3 ${GlyphImageBadge.success}`}>
                <Lock className="w-3 h-3" />
                Cryptographically Secured
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right - Canvas */}
      <div className="lg:col-span-2">
        <Card className={`${GlyphImageCard.premium} ${GlyphImageShadows.depth.lg}`}>
          <CardHeader className="border-b border-purple-500/20">
            <CardTitle className={`${GlyphImageTypography.heading.md} text-white`}>
              {imageAsset.name}
            </CardTitle>
          </CardHeader>
          <CardContent className={GlyphImagePanel.primary}>
            <div
              ref={canvasRef}
              className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-crosshair"
              onMouseDown={handleCanvasMouseDown}
              onMouseUp={handleCanvasMouseUp}
            >
              <img src={imageAsset.fileUrl} alt={imageAsset.name} className="w-full h-full object-contain" />

              {/* Render hotspots */}
              {hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  onClick={() => setSelectedHotspot(hotspot)}
                  className={`absolute border-2 cursor-pointer transition-all ${
                    selectedHotspot?.id === hotspot.id
                      ? 'border-cyan-400 bg-cyan-400/20'
                      : 'border-purple-400 bg-purple-400/10 hover:bg-purple-400/20'
                  }`}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    width: `${hotspot.width}%`,
                    height: `${hotspot.height}%`,
                  }}
                >
                  <div className="absolute -top-6 left-0 text-xs font-semibold text-white bg-black/70 px-2 py-1 rounded">
                    {hotspot.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-400">
              {activeTool === 'rectangle' ? 'Click and drag to create a hotspot' : 'Click a hotspot to edit it'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}