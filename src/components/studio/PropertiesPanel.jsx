import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Save, Hash, CheckCircle2 } from "lucide-react";
import FinalizeModal from "./FinalizeModal";

export default function PropertiesPanel({ 
  selectedHotspot, 
  hotspots,
  onUpdateHotspot, 
  onDeleteHotspot,
  onSelectHotspot,
  onSave,
  onFinalize
}) {
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    actionType: 'none',
    actionValue: ''
  });
  const [saving, setSaving] = useState(false);
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);
  const [finalizeResult, setFinalizeResult] = useState(null);

  useEffect(() => {
    if (selectedHotspot) {
      setFormData({
        label: selectedHotspot.label || '',
        description: selectedHotspot.description || '',
        actionType: selectedHotspot.actionType || 'none',
        actionValue: selectedHotspot.actionValue || ''
      });
    }
  }, [selectedHotspot]);

  const handleUpdate = () => {
    if (selectedHotspot) {
      onUpdateHotspot({ ...selectedHotspot, ...formData });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave();
      alert('Hotspots saved successfully!');
    } catch (error) {
      alert('Failed to save hotspots: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFinalize = async () => {
    try {
      const result = await onFinalize();
      setFinalizeResult(result);
      setFinalizeModalOpen(true);
    } catch (error) {
      alert('Failed to finalize: ' + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="glass-royal border-cyan-500/30" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
        <CardHeader className="border-b border-cyan-500/30" style={{background: 'transparent'}}>
          <CardTitle className="text-white text-lg">Hotspot Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6" style={{background: 'transparent'}}>
          {selectedHotspot ? (
            <div className="space-y-4">
              <div>
                <Label className="text-white/80 text-sm">Label</Label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  onBlur={handleUpdate}
                  className="glass-card-dark border-cyan-500/30 text-white mt-1"
                />
              </div>

              <div>
                <Label className="text-white/80 text-sm">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  onBlur={handleUpdate}
                  rows={3}
                  className="glass-card-dark border-cyan-500/30 text-white mt-1"
                />
              </div>

              <div>
                <Label className="text-white/80 text-sm">Action Type</Label>
                <Select
                  value={formData.actionType}
                  onValueChange={(value) => {
                    const updated = { ...formData, actionType: value };
                    setFormData(updated);
                    onUpdateHotspot({ ...selectedHotspot, ...updated });
                  }}
                >
                  <SelectTrigger className="glass-card-dark border-cyan-500/30 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card-dark border-cyan-500/30">
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="link">Link (New Tab)</SelectItem>
                    <SelectItem value="redirect">Redirect (Same Window)</SelectItem>
                    <SelectItem value="show_tooltip">Show Tooltip</SelectItem>
                    <SelectItem value="text">Text Panel</SelectItem>
                    <SelectItem value="trigger_event">Trigger Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.actionType !== 'none' && (
                <div>
                  <Label className="text-white/80 text-sm">
                    {formData.actionType === 'link' && 'URL (opens in new tab)'}
                    {formData.actionType === 'redirect' && 'URL (redirects current window)'}
                    {formData.actionType === 'show_tooltip' && 'Tooltip Text'}
                    {formData.actionType === 'text' && 'Text Content'}
                    {formData.actionType === 'trigger_event' && 'Event Name'}
                  </Label>
                  <Input
                    value={formData.actionValue}
                    onChange={(e) => setFormData({ ...formData, actionValue: e.target.value })}
                    onBlur={handleUpdate}
                    placeholder={
                      formData.actionType === 'link' || formData.actionType === 'redirect' 
                        ? 'https://...' 
                        : formData.actionType === 'trigger_event'
                        ? 'event_name'
                        : 'Enter text...'
                    }
                    className="glass-card-dark border-cyan-500/30 text-white mt-1"
                  />
                  {formData.actionType === 'trigger_event' && (
                    <p className="text-xs text-cyan-400/70 mt-1">
                      Custom event will be dispatched with hotspot data
                    </p>
                  )}
                  {formData.actionType === 'show_tooltip' && (
                    <p className="text-xs text-cyan-400/70 mt-1">
                      Tooltip appears on hotspot hover
                    </p>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-cyan-500/30">
                <Label className="text-white/60 text-xs">Position</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-white/70">
                  <div>X: {selectedHotspot.x.toFixed(1)}%</div>
                  <div>Y: {selectedHotspot.y.toFixed(1)}%</div>
                  <div>W: {selectedHotspot.width.toFixed(1)}%</div>
                  <div>H: {selectedHotspot.height.toFixed(1)}%</div>
                </div>
              </div>

              <Button
                onClick={onDeleteHotspot}
                variant="outline"
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Hotspot
              </Button>
            </div>
          ) : (
            <p className="text-white/40 text-center py-8 text-sm">
              Select a hotspot to edit its properties
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="glass-royal border-cyan-500/30" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
        <CardHeader className="border-b border-cyan-500/30" style={{background: 'transparent'}}>
          <CardTitle className="text-white text-lg">Current Hotspots ({hotspots.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-4" style={{background: 'transparent'}}>
          {hotspots.length === 0 ? (
            <p className="text-white/40 text-center py-4 text-sm">No hotspots yet</p>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  onClick={() => onSelectHotspot(hotspot)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all
                    ${selectedHotspot?.id === hotspot.id
                      ? 'bg-cyan-500/20 border-2 border-cyan-400'
                      : 'bg-cyan-900/20 border-2 border-cyan-500/30 hover:border-cyan-500/50'
                    }
                  `}
                >
                  <h4 className="font-semibold text-white text-sm">{hotspot.label}</h4>
                  <p className="text-xs text-white/50 mt-1">
                    {hotspot.x.toFixed(1)}%, {hotspot.y.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-royal border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/10" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
        <CardHeader className="border-b border-cyan-500/30" style={{background: 'transparent'}}>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Hash className="w-5 h-5 text-cyan-400" />
            Finalize & Hash
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3" style={{background: 'transparent'}}>
          <p className="text-white/60 text-sm">
            Lock in this interactive image and generate a cryptographic hash for verification.
          </p>
          
          <Button
            onClick={handleSave}
            disabled={saving || hotspots.length === 0}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Hotspots'}
          </Button>

          <Button
            onClick={handleFinalize}
            disabled={hotspots.length === 0}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-black font-bold shadow-lg shadow-cyan-500/50"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Finalize & Hash
          </Button>
        </CardContent>
      </Card>

      <FinalizeModal
        open={finalizeModalOpen}
        onClose={() => setFinalizeModalOpen(false)}
        result={finalizeResult}
      />
    </div>
  );
}