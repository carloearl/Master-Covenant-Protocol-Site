import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Save, Lock, Trash2, Sparkles, MousePointer, Link2, ExternalLink, Share2, Users, Send, ScanLine, Layers, Zap } from 'lucide-react';
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
import UniversalAssetPicker from '@/components/shared/UniversalAssetPicker';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCollaboration } from '@/components/hooks/useCollaboration';
import CollaborationPanel from '@/components/qr/CollaborationPanel';
import ShareInteractiveDialog from '@/components/imageLab/ShareInteractiveDialog';

export default function InteractiveTab({ user, selectedImage, onImageSelect }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [imageAsset, setImageAsset] = useState(selectedImage);
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [pendingClick, setPendingClick] = useState(null);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [collabSessionId, setCollabSessionId] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Collaboration Hook
  const { activeUsers, messages, isConnected, sendMessage, sendStateUpdate } = useCollaboration({
    projectId: collabSessionId,
    currentUser: user,
    onStateUpdate: (data) => {
      if (data.hotspots) setHotspots(data.hotspots);
    }
  });

  // Broadcast hotspot changes
  useEffect(() => {
    if (collabSessionId && isConnected) {
      sendStateUpdate({ hotspots });
    }
  }, [hotspots, collabSessionId, isConnected]);

  useEffect(() => {
    if (selectedImage) {
      setImageAsset(selectedImage);
      setHotspots(selectedImage.hotspots || []);
    }
  }, [selectedImage]);

  const startCollaboration = () => {
    if (!imageAsset?.id) return;
    const sessionId = `img_collab_${imageAsset.id}`;
    setCollabSessionId(sessionId);
    toast.success("Collaboration session started! Others can join using this Image ID.");
  };

  // Auto-detect all objects in the image
  const handleAutoDetectAll = async () => {
    if (!imageAsset?.fileUrl) return;
    
    setAnalyzing(true);
    try {
      const response = await base44.functions.invoke('imageLabOps', {
        operation: 'detectObjects',
        imageUrl: imageAsset.fileUrl
      });

      if (response.data.success && response.data.objects?.length > 0) {
        const newHotspots = response.data.objects
          .filter(obj => obj.is_clickable && obj.confidence > 50)
          .map((obj, idx) => ({
            id: `hz_auto_${Date.now()}_${idx}`,
            x: obj.bounding_box?.x ?? 0,
            y: obj.bounding_box?.y ?? 0,
            width: obj.bounding_box?.width ?? 10,
            height: obj.bounding_box?.height ?? 10,
            shape: 'rect',
            label: obj.object_name || `Object ${idx + 1}`,
            description: obj.object_name,
            actionType: obj.suggested_action || 'openUrl',
            actionValue: '',
            payload: { type: obj.suggested_action || 'openUrl', value: '', metadata: {} },
            aiDetected: true,
            confidence: obj.confidence || 0,
            autoDetected: true
          }));

        setHotspots(prev => [...prev, ...newHotspots]);
        toast.success(`Detected ${newHotspots.length} interactive objects!`);
      } else {
        toast.info('No clickable objects detected');
      }
    } catch (error) {
      console.error('Auto-detect error:', error);
      toast.error('Failed to detect objects');
    } finally {
      setAnalyzing(false);
    }
  };

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
        ownerEmail: user?.email || 'guest',
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

  // AI-powered click detection via backend
  const handleCanvasClick = async (e) => {
    if (!imageAsset?.fileUrl || analyzing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicking on existing hotspot
    const clickedHotspot = hotspots.find(h => 
      clickX >= h.x && clickX <= h.x + h.width &&
      clickY >= h.y && clickY <= h.y + h.height
    );

    if (clickedHotspot) {
      setSelectedHotspot(clickedHotspot);
      setPendingClick(null);
      return;
    }

    // New click - analyze with AI via backend
    setPendingClick({ x: clickX, y: clickY });
    setAnalyzing(true);

    try {
      const response = await base44.functions.invoke('imageLabOps', {
        operation: 'createHotzone',
        imageId: imageAsset.id,
        imageUrl: imageAsset.fileUrl,
        clickX,
        clickY
      });

      if (response.data.success) {
        const hz = response.data.hotzone;
        
        // Create hotspot from backend response
        const newHotspot = {
          id: hz.id,
          x: hz.x,
          y: hz.y,
          width: hz.width,
          height: hz.height,
          shape: hz.shape || 'rect',
          label: hz.label,
          description: hz.description || hz.detectedObject || '',
          actionType: hz.actionType || 'openUrl',
          actionValue: hz.actionValue || '',
          payload: hz.payload || { type: 'openUrl', value: '', metadata: {} },
          aiDetected: true,
          detectedObject: hz.detectedObject,
          confidence: hz.confidence || 0,
          createdAt: hz.createdAt
        };

        setHotspots([...hotspots, newHotspot]);
        setSelectedHotspot(newHotspot);
        toast.success(`Detected: ${response.data.detected || 'Object'} (${response.data.confidence || 0}% confidence)`);
      }
    } catch (error) {
      console.error('AI detection error:', error);
      
      // Fallback: create a simple hotspot at click location
      const fallbackHotspot = {
        id: `hz_${Date.now()}`,
        x: Math.max(0, clickX - 5),
        y: Math.max(0, clickY - 5),
        width: 10,
        height: 10,
        shape: 'rect',
        label: `Hotspot ${hotspots.length + 1}`,
        description: '',
        actionType: 'openUrl',
        actionValue: '',
        payload: { type: 'openUrl', value: '', metadata: {} },
        aiDetected: false
      };

      setHotspots([...hotspots, fallbackHotspot]);
      setSelectedHotspot(fallbackHotspot);
      toast.info('Created hotspot (AI detection unavailable)');
    } finally {
      setAnalyzing(false);
      setPendingClick(null);
    }
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

  // Execute hotspot action (for preview/testing)
  const handleHotspotAction = (hotspot, e) => {
    e.stopPropagation();
    
    if (!hotspot.actionValue) {
      toast.info('No action URL set for this hotspot');
      return;
    }

    switch (hotspot.actionType) {
      case 'openUrl':
        window.open(hotspot.actionValue, '_blank', 'noopener,noreferrer');
        break;
      case 'showModal':
        toast.info(`Modal content: ${hotspot.actionValue}`);
        break;
      case 'playAudio':
        const audio = new Audio(hotspot.actionValue);
        audio.play().catch(() => toast.error('Failed to play audio'));
        break;
      default:
        window.open(hotspot.actionValue, '_blank', 'noopener,noreferrer');
    }
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
        <p className="text-gray-400 text-lg mb-4">Upload an image or select from Gallery to add interactive hotspots</p>
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
    <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-3 gap-6'}`}>
      {/* Left - Instructions & Properties */}
      <div className={`${isMobile ? 'space-y-4 order-2' : 'lg:col-span-1 space-y-6'}`}>
        {/* AI Click Instructions */}
        <Card className={`${GlyphImageCard.premium} border-cyan-500/30`}>
          <CardHeader className="border-b border-cyan-500/20 pb-3">
            <CardTitle className={`${GlyphImageTypography.heading.md} text-white flex items-center gap-2`}>
              <Sparkles className="w-5 h-5 text-cyan-400" />
              AI-Powered Hotzones
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <MousePointer className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Click anywhere on the image</p>
                  <p className="text-gray-400 text-xs mt-1">AI detects objects and creates intelligent bounding zones</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Configure payload actions</p>
                  <p className="text-gray-400 text-xs mt-1">URLs, modals, audio, agents, access verification</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <ExternalLink className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Test & share</p>
                  <p className="text-gray-400 text-xs mt-1">Preview actions live, then share your interactive image</p>
                </div>
              </div>
            </div>

            {/* Auto-detect all objects button */}
            <Button
              onClick={handleAutoDetectAll}
              disabled={analyzing || !imageAsset}
              className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            >
              <ScanLine className="w-4 h-4 mr-2" />
              Auto-Detect All Objects
            </Button>
          </CardContent>
        </Card>

        {/* Hotspot Properties */}
        {selectedHotspot && (
          <Card className={`${GlyphImageCard.premium}`}>
            <CardHeader className="border-b border-purple-500/20">
              <CardTitle className={`${GlyphImageTypography.heading.md} text-white flex items-center justify-between`}>
                <span>Hotspot Settings</span>
                {selectedHotspot.aiDetected && (
                  <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
                    AI Detected
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className={GlyphImagePanel.compact}>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300 text-sm">Label</Label>
                  <Input
                    value={selectedHotspot.label}
                    onChange={(e) => handleUpdateHotspot('label', e.target.value)}
                    className={GlyphImageInput.base}
                    placeholder="Button, Logo, Product..."
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Description</Label>
                  <Textarea
                    value={selectedHotspot.description}
                    onChange={(e) => handleUpdateHotspot('description', e.target.value)}
                    className={GlyphImageInput.base}
                    rows={2}
                    placeholder="What AI detected..."
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Action Type</Label>
                  <Select
                    value={selectedHotspot.actionType}
                    onValueChange={(val) => handleUpdateHotspot('actionType', val)}
                  >
                    <SelectTrigger className={GlyphImageInput.base}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="openUrl">Open URL</SelectItem>
                      <SelectItem value="playAudio">Play Audio</SelectItem>
                      <SelectItem value="showModal">Show Modal</SelectItem>
                      <SelectItem value="invokeAgent">Invoke Agent</SelectItem>
                      <SelectItem value="verifyAccess">Verify Access</SelectItem>
                      <SelectItem value="downloadFile">Download File</SelectItem>
                      <SelectItem value="shareLink">Share Link</SelectItem>
                      <SelectItem value="zoomIn">Zoom In</SelectItem>
                      <SelectItem value="showInfo">Show Info Tooltip</SelectItem>
                      <SelectItem value="triggerWebhook">Trigger Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Confidence badge if AI detected */}
                {selectedHotspot.aiDetected && selectedHotspot.confidence > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">AI Confidence:</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      selectedHotspot.confidence > 80 ? 'bg-green-500/20 text-green-400' :
                      selectedHotspot.confidence > 50 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedHotspot.confidence}%
                    </span>
                  </div>
                )}
                <div>
                  <Label className="text-gray-300 text-sm font-semibold flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-cyan-400" />
                    Action URL / Payload
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={selectedHotspot.actionValue}
                      onChange={(e) => handleUpdateHotspot('actionValue', e.target.value)}
                      placeholder="https://example.com or payload"
                      className={`${GlyphImageInput.base} mt-1`}
                    />
                    <Button 
                      onClick={() => setShowAssetPicker(true)}
                      variant="outline"
                      className="mt-1 border-cyan-500/30 text-cyan-400"
                      title="Link Asset"
                    >
                      <Link2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Link a URL, QR Code, or other asset</p>
                </div>
                
                {/* Test Button */}
                {selectedHotspot.actionValue && (
                  <Button 
                    onClick={(e) => handleHotspotAction(selectedHotspot, e)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Test Action
                  </Button>
                )}

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
              
              {/* Share Button */}
              <Button
                onClick={() => setShowShareDialog(true)}
                disabled={!imageAsset || hotspots.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Share Interactive Image
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

        {/* Hotspot List */}
        {hotspots.length > 0 && (
          <Card className={`${GlyphImageCard.glass}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">
                {hotspots.length} Hotspot{hotspots.length !== 1 ? 's' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {hotspots.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHotspot(h)}
                    className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                      selectedHotspot?.id === h.id
                        ? 'bg-cyan-500/20 border border-cyan-500/50'
                        : 'bg-slate-800/50 hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium truncate">{h.label}</span>
                      {h.actionValue && (
                        <Link2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                    {h.actionValue && (
                      <p className="text-xs text-gray-500 truncate mt-1">{h.actionValue}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right - Canvas */}
      <div className={`${isMobile ? 'order-1' : 'lg:col-span-2'}`}>
        {collabSessionId && (
          <CollaborationPanel 
            activeUsers={activeUsers}
            isConnected={isConnected}
            messages={messages}
            onSendMessage={sendMessage}
            currentUser={user}
          />
        )}
        
        <Card className={`${GlyphImageCard.premium} ${GlyphImageShadows.depth.lg}`}>
          <CardHeader className="border-b border-purple-500/20">
            <CardTitle className={`${GlyphImageTypography.heading.md} text-white flex items-center justify-between`}>
              <span>{imageAsset.name}</span>
              <div className="flex items-center gap-2">
                {!collabSessionId && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={startCollaboration}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Collaborate
                  </Button>
                )}
                {analyzing && (
                  <span className="flex items-center gap-2 text-sm text-cyan-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI analyzing...
                  </span>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className={GlyphImagePanel.primary}>
            <div
              ref={canvasRef}
              className={`relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden ${
                analyzing ? 'cursor-wait' : 'cursor-crosshair'
              }`}
              onClick={handleCanvasClick}
            >
              <img 
                ref={imageRef}
                src={imageAsset.fileUrl} 
                alt={imageAsset.name} 
                className="w-full h-full object-contain pointer-events-none" 
              />

              {/* Pending click indicator */}
              {pendingClick && (
                <div
                  className="absolute w-8 h-8 -ml-4 -mt-4 border-2 border-cyan-400 rounded-full animate-ping"
                  style={{ left: `${pendingClick.x}%`, top: `${pendingClick.y}%` }}
                />
              )}

              {/* Render hotspots */}
              {hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hotspot.actionValue) {
                      handleHotspotAction(hotspot, e);
                    } else {
                      setSelectedHotspot(hotspot);
                    }
                  }}
                  className={`absolute border-2 cursor-pointer transition-all group ${
                    selectedHotspot?.id === hotspot.id
                      ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                      : hotspot.actionValue
                        ? 'border-green-400 bg-green-400/10 hover:bg-green-400/30 hover:shadow-[0_0_15px_rgba(74,222,128,0.5)]'
                        : 'border-purple-400 bg-purple-400/10 hover:bg-purple-400/20'
                  }`}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    width: `${hotspot.width}%`,
                    height: `${hotspot.height}%`,
                  }}
                >
                  {/* Label */}
                  <div className="absolute -top-7 left-0 text-xs font-semibold text-white bg-black/80 px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {hotspot.label}
                    {hotspot.actionValue && (
                      <ExternalLink className="w-3 h-3 inline ml-1 text-green-400" />
                    )}
                  </div>

                  {/* Action indicator */}
                  {hotspot.actionValue && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-green-500/90 rounded-full p-2">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-400">
                {analyzing ? 'AI is detecting the object you clicked...' : 'Click anywhere to create an AI-detected hotspot'}
              </span>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-green-400 rounded-sm" />
                  <span className="text-gray-500">Has URL</span>
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-purple-400 rounded-sm" />
                  <span className="text-gray-500">No URL</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAssetPicker} onOpenChange={setShowAssetPicker}>
        <DialogContent className="max-w-3xl bg-transparent border-none p-0">
          <UniversalAssetPicker 
            onSelect={(asset) => {
              const value = asset.type === 'qr' ? asset.payload : asset.fileUrl;
              handleUpdateHotspot('actionValue', value);
              setShowAssetPicker(false);
              toast.success(`Linked ${asset.type === 'qr' ? 'QR Code' : 'Image'}`);
            }} 
            onCancel={() => setShowAssetPicker(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <ShareInteractiveDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        imageAsset={imageAsset}
        hotspots={hotspots}
      />
    </div>
  );
}