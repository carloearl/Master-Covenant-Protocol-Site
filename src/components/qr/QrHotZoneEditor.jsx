import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { validateHotZone } from './qrUtils';
import { toast } from 'sonner';

export default function QrHotZoneEditor({ qrImageUrl, hotZones = [], onHotZonesChange }) {
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const addZone = () => {
    const newZone = {
      zoneId: `zone-${Date.now()}`,
      shape: 'rect',
      coords: [25, 25, 20, 20], // [x%, y%, width%, height%]
      triggerType: 'tap',
      actionType: 'openUrl',
      actionValue: ''
    };

    const validation = validateHotZone(newZone);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    onHotZonesChange([...hotZones, newZone]);
    setSelectedZoneId(newZone.zoneId);
  };

  const removeZone = (zoneId) => {
    onHotZonesChange(hotZones.filter(z => z.zoneId !== zoneId));
    if (selectedZoneId === zoneId) {
      setSelectedZoneId(null);
    }
  };

  const updateZone = (zoneId, updates) => {
    onHotZonesChange(
      hotZones.map(z => z.zoneId === zoneId ? { ...z, ...updates } : z)
    );
  };

  const handleMouseDown = (e, zoneId) => {
    e.preventDefault();
    setSelectedZoneId(zoneId);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedZoneId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const zone = hotZones.find(z => z.zoneId === selectedZoneId);
    if (zone) {
      updateZone(selectedZoneId, {
        coords: [
          Math.max(0, Math.min(100 - zone.coords[2], x)),
          Math.max(0, Math.min(100 - zone.coords[3], y)),
          zone.coords[2],
          zone.coords[3]
        ]
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectedZone = hotZones.find(z => z.zoneId === selectedZoneId);

  return (
    <Card className="w-full bg-gray-900/50 border-gray-800 shadow-xl">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-lg lg:text-xl">Hot Zone Editor</span>
          <Button
            onClick={addZone}
            size="sm"
            className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 min-h-[48px] px-6 shadow-lg shadow-cyan-500/30"
          >
            <Plus className="w-5 h-5" />
            Add Zone
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* QR Image with Overlays */}
        <div
          ref={containerRef}
          className="relative bg-white rounded-lg overflow-hidden shadow-lg"
          style={{ aspectRatio: '1/1', maxWidth: '600px', margin: '0 auto' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
          }}
          onTouchEnd={handleMouseUp}
        >
          {qrImageUrl ? (
            <>
              <img
                src={qrImageUrl}
                alt="QR Code"
                className="w-full h-full object-contain"
                draggable={false}
              />
              {hotZones.map(zone => (
                <div
                  key={zone.zoneId}
                  onMouseDown={(e) => handleMouseDown(e, zone.zoneId)}
                  style={{
                    position: 'absolute',
                    left: `${zone.coords[0]}%`,
                    top: `${zone.coords[1]}%`,
                    width: `${zone.coords[2]}%`,
                    height: `${zone.coords[3]}%`,
                    border: `2px ${zone.zoneId === selectedZoneId ? 'solid' : 'dashed'} ${zone.zoneId === selectedZoneId ? '#06b6d4' : '#3b82f6'}`,
                    backgroundColor: `${zone.zoneId === selectedZoneId ? 'rgba(6, 182, 212, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`,
                    cursor: 'move',
                    minHeight: '44px',
                    minWidth: '44px'
                  }}
                />
              ))}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Generate QR first</span>
            </div>
          )}
        </div>

        {/* Zone Properties */}
        {selectedZone && (
          <div className="space-y-4 p-4 lg:p-6 bg-gray-800/50 rounded-lg border border-gray-700 shadow-inner">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-base font-semibold">Zone: {selectedZone.zoneId}</Label>
              <Button
                onClick={() => removeZone(selectedZone.zoneId)}
                size="sm"
                variant="destructive"
                className="min-h-[48px] px-4"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="triggerType" className="text-gray-300">Trigger</Label>
                <Select
                  value={selectedZone.triggerType}
                  onValueChange={(value) => updateZone(selectedZone.zoneId, { triggerType: value })}
                >
                  <SelectTrigger id="triggerType" className="min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scan">Scan</SelectItem>
                    <SelectItem value="tap">Tap</SelectItem>
                    <SelectItem value="hover">Hover</SelectItem>
                    <SelectItem value="hold">Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionType" className="text-gray-300">Action</Label>
                <Select
                  value={selectedZone.actionType}
                  onValueChange={(value) => updateZone(selectedZone.zoneId, { actionType: value })}
                >
                  <SelectTrigger id="actionType" className="min-h-[44px]">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionValue" className="text-gray-300">Action Value</Label>
              <Input
                id="actionValue"
                value={selectedZone.actionValue}
                onChange={(e) => updateZone(selectedZone.zoneId, { actionValue: e.target.value })}
                placeholder={selectedZone.actionType === 'openUrl' ? 'https://example.com' : 'Value'}
                className="min-h-[44px]"
              />
            </div>
          </div>
        )}

        {/* Zone List */}
        {hotZones.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-300">All Zones ({hotZones.length})</Label>
            <div className="space-y-2">
              {hotZones.map(zone => (
                <div
                  key={zone.zoneId}
                  onClick={() => setSelectedZoneId(zone.zoneId)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    zone.zoneId === selectedZoneId
                      ? 'bg-cyan-600/20 border-2 border-cyan-500'
                      : 'bg-gray-800/30 border border-gray-700 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="text-sm text-gray-300">
                    <strong>{zone.triggerType}</strong> → {zone.actionType}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{zone.actionValue}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}