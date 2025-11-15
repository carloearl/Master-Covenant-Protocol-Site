import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save, MapPin } from "lucide-react";
import SeverityBadge from "@/components/shared/SeverityBadge";
import FileUploader from "@/components/shared/FileUploader";

export default function HotzoneMapper() {
  const [mapName, setMapName] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [hotspots, setHotspots] = useState([]);
  const [hotspotForm, setHotspotForm] = useState({
    name: "",
    description: "",
    severity: "medium",
    url: "",
    status: "active"
  });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedImage(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setImageUrl(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (e) => {
    if (!imageUrl) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = imageDimensions.width / rect.width;
    const scaleY = imageDimensions.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (hotspotForm.name) {
      setHotspots([...hotspots, { x, y, ...hotspotForm }]);
      setHotspotForm({
        name: "",
        description: "",
        severity: "medium",
        url: "",
        status: "active"
      });
    }
  };

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      hotspots.forEach((hotspot) => {
        const color = hotspot.severity === "critical" ? "#ef4444" :
                     hotspot.severity === "high" ? "#f97316" :
                     hotspot.severity === "medium" ? "#eab308" : "#3b82f6";
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(hotspot.x, hotspot.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(hotspot.name, hotspot.x + 15, hotspot.y + 5);
      });
    };

    img.src = imageUrl;
  }, [imageUrl, hotspots]);

  const saveMapMutation = useMutation({
    mutationFn: async () => {
      let finalImageUrl = imageUrl;
      
      if (uploadedImage) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: uploadedImage });
        finalImageUrl = file_url;
      }

      return base44.entities.HotzoneMap.create({
        name: mapName,
        description: mapDescription,
        image_url: finalImageUrl,
        image_width: imageDimensions.width,
        image_height: imageDimensions.height,
        hotspots: hotspots,
        map_type: "infrastructure",
        status: "active",
        threat_level: "low"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['maps']);
      alert('Map saved successfully!');
      setMapName("");
      setMapDescription("");
      setImageUrl(null);
      setHotspots([]);
    }
  });

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Interactive Security Map
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-white">Map Name *</Label>
                <Input
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  placeholder="Infrastructure Map"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={mapDescription}
                  onChange={(e) => setMapDescription(e.target.value)}
                  placeholder="Describe this security map..."
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={2}
                />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {!imageUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-white">Click to upload base map image</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="w-full cursor-crosshair"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-gray-700 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                  <Button
                    onClick={() => saveMapMutation.mutate()}
                    disabled={!mapName || hotspots.length === 0 || saveMapMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saveMapMutation.isPending ? 'Saving...' : 'Save Map'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Add Hotspot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Hotspot Name *</Label>
              <Input
                value={hotspotForm.name}
                onChange={(e) => setHotspotForm({...hotspotForm, name: e.target.value})}
                placeholder="Server Room"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                value={hotspotForm.description}
                onChange={(e) => setHotspotForm({...hotspotForm, description: e.target.value})}
                placeholder="Details..."
                className="bg-gray-800 border-gray-700 text-white"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-white">Severity</Label>
              <Select value={hotspotForm.severity} onValueChange={(value) => setHotspotForm({...hotspotForm, severity: value})}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-400">
              Fill the form above, then click on the map to place a hotspot marker
            </div>
          </CardContent>
        </Card>

        {hotspots.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">
                Hotspots ({hotspots.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {hotspots.map((hotspot, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                  <span className="text-white text-sm">{hotspot.name}</span>
                  <SeverityBadge severity={hotspot.severity} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}