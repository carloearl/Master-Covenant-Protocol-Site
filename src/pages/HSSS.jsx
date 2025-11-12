import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Upload, MapPin, Crosshair, Download, Trash2, Save, AlertTriangle,
  Shield, Activity, Eye, Target, Bell, FileText, TrendingUp
} from "lucide-react";
import FreeTrialGuard from "../components/FreeTrialGuard";

export default function HSSS() {
  const queryClient = useQueryClient();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapData, setMapData] = useState({
    name: "",
    description: "",
    map_type: "network",
    threat_level: "low"
  });
  const [hotspotForm, setHotspotForm] = useState({
    name: "",
    description: "",
    severity: "medium",
    url: "",
    status: "active"
  });
  const canvasRef = useRef(null);

  // Fetch existing maps
  const { data: maps = [] } = useQuery({
    queryKey: ['hotzone-maps'],
    queryFn: () => base44.entities.HotzoneMap.list('-created_date', 50),
    initialData: []
  });

  // Fetch threats
  const { data: threats = [] } = useQuery({
    queryKey: ['hotzone-threats'],
    queryFn: () => base44.entities.HotzoneThreat.list('-created_date', 100),
    initialData: []
  });

  // Save map mutation
  const saveMapMutation = useMutation({
    mutationFn: async (data) => {
      let imageUrl = data.image_url;
      
      if (imageFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: imageFile });
        imageUrl = file_url;
      }

      return base44.entities.HotzoneMap.create({
        ...data,
        image_url: imageUrl,
        image_width: image.width,
        image_height: image.height,
        hotspots: hotspots,
        last_scan: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotzone-maps'] });
      alert('Security map saved successfully!');
    }
  });

  // Log threat mutation
  const logThreatMutation = useMutation({
    mutationFn: (data) => base44.entities.HotzoneThreat.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotzone-threats'] });
    }
  });

  useEffect(() => {
    if (image && canvasRef.current) {
      drawCanvas();
    }
  }, [image, hotspots, selectedHotspot]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setHotspots([]);
          setSelectedHotspot(null);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    hotspots.forEach((hotspot, index) => {
      const isSelected = selectedHotspot === index;
      const color = getSeverityColor(hotspot.severity);

      // Pulsing effect for critical hotspots
      const radius = hotspot.severity === 'critical' && !isSelected ? 22 : isSelected ? 25 : 20;

      ctx.beginPath();
      ctx.arc(hotspot.x, hotspot.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = isSelected ? 4 : 3;
      ctx.stroke();
      ctx.fillStyle = color + "40";
      ctx.fill();

      // Crosshair
      ctx.beginPath();
      ctx.moveTo(hotspot.x - 15, hotspot.y);
      ctx.lineTo(hotspot.x + 15, hotspot.y);
      ctx.moveTo(hotspot.x, hotspot.y - 15);
      ctx.lineTo(hotspot.x, hotspot.y + 15);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label with status indicator
      ctx.fillStyle = color;
      ctx.font = "bold 14px Arial";
      const label = `#${index + 1}${hotspot.status === 'escalated' ? ' ⚠' : ''}`;
      ctx.fillText(label, hotspot.x + 30, hotspot.y + 5);
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "#10b981",
      medium: "#f59e0b", 
      high: "#ef4444",
      critical: "#dc2626"
    };
    return colors[severity] || colors.medium;
  };

  const handleCanvasClick = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const clickedIndex = hotspots.findIndex(
      (h) => Math.sqrt((h.x - x) ** 2 + (h.y - y) ** 2) < 25
    );

    if (clickedIndex !== -1) {
      setSelectedHotspot(clickedIndex);
      const hotspot = hotspots[clickedIndex];
      setHotspotForm({
        name: hotspot.name,
        description: hotspot.description,
        severity: hotspot.severity,
        url: hotspot.url || "",
        status: hotspot.status || "active"
      });
    } else {
      const newHotspot = {
        x,
        y,
        name: `Zone ${hotspots.length + 1}`,
        description: "",
        severity: "medium",
        url: "",
        status: "active"
      };
      setHotspots([...hotspots, newHotspot]);
      setSelectedHotspot(hotspots.length);
      setHotspotForm({
        name: newHotspot.name,
        description: "",
        severity: "medium",
        url: "",
        status: "active"
      });
    }
  };

  const updateHotspot = () => {
    if (selectedHotspot === null) return;

    const updatedHotspots = [...hotspots];
    updatedHotspots[selectedHotspot] = {
      ...updatedHotspots[selectedHotspot],
      ...hotspotForm
    };
    setHotspots(updatedHotspots);
  };

  const deleteHotspot = () => {
    if (selectedHotspot === null) return;
    const updatedHotspots = hotspots.filter((_, index) => index !== selectedHotspot);
    setHotspots(updatedHotspots);
    setSelectedHotspot(null);
    setHotspotForm({
      name: "",
      description: "",
      severity: "medium",
      url: "",
      status: "active"
    });
  };

  const saveMap = () => {
    if (!mapData.name || !image) {
      alert('Please provide a map name and upload an image');
      return;
    }
    saveMapMutation.mutate(mapData);
  };

  const loadMap = async (map) => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setHotspots(map.hotspots || []);
      setMapData({
        name: map.name,
        description: map.description,
        map_type: map.map_type,
        threat_level: map.threat_level
      });
    };
    img.src = map.image_url;
  };

  const exportData = () => {
    const data = {
      ...mapData,
      hotspots: hotspots,
      imageWidth: image.width,
      imageHeight: image.height,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hsss-${mapData.name || 'map'}-${Date.now()}.json`;
    a.click();
  };

  const calculateStats = () => {
    const critical = hotspots.filter(h => h.severity === 'critical').length;
    const high = hotspots.filter(h => h.severity === 'high').length;
    const active = hotspots.filter(h => h.status === 'active').length;
    const escalated = hotspots.filter(h => h.status === 'escalated').length;
    return { critical, high, active, escalated };
  };

  const stats = calculateStats();

  const activeThreatCount = threats.filter(t => t.status === 'detected' || t.status === 'investigating').length;
  const criticalThreatCount = threats.filter(t => t.severity === 'critical').length;

  return (
    <FreeTrialGuard serviceName="HSSS">
      <div className="bg-black text-white min-h-screen py-20 relative">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8cd0364f8_Whisk_2bd57b9a449d359968944ab33f98257edr-Copy.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-red-500/50 bg-red-500/10 text-red-400 mb-6 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Hotzone Security Surveillance System
            </Badge>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent">HSSS</span>
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Advanced security surveillance with real-time threat monitoring, AI detection, and incident tracking
            </p>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-red-900/20 backdrop-blur-md border-red-500/30">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.critical}</div>
                <div className="text-xs text-white/60">Critical Zones</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-900/20 backdrop-blur-md border-orange-500/30">
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.active}</div>
                <div className="text-xs text-white/60">Active Monitors</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-900/20 backdrop-blur-md border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{activeThreatCount}</div>
                <div className="text-xs text-white/60">Active Threats</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{hotspots.length}</div>
                <div className="text-xs text-white/60">Total Hotspots</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="mapper" className="space-y-6">
            <TabsList className="bg-blue-900/30 backdrop-blur-md border border-blue-500/30">
              <TabsTrigger value="mapper" className="text-white data-[state=active]:bg-red-500/30">
                <MapPin className="w-4 h-4 mr-2" />
                Mapper
              </TabsTrigger>
              <TabsTrigger value="threats" className="text-white data-[state=active]:bg-orange-500/30">
                <Bell className="w-4 h-4 mr-2" />
                Threats ({activeThreatCount})
              </TabsTrigger>
              <TabsTrigger value="maps" className="text-white data-[state=active]:bg-blue-500/30">
                <FileText className="w-4 h-4 mr-2" />
                Saved Maps ({maps.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-green-500/30">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mapper">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Canvas */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <CardTitle className="text-white mb-2">Security Map Canvas</CardTitle>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className={`text-xs ${
                              mapData.threat_level === 'critical' ? 'border-red-500 text-red-400 bg-red-500/10' :
                              mapData.threat_level === 'high' ? 'border-orange-500 text-orange-400 bg-orange-500/10' :
                              mapData.threat_level === 'medium' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' :
                              'border-green-500 text-green-400 bg-green-500/10'
                            }`}>
                              Threat Level: {mapData.threat_level}
                            </Badge>
                            <Badge variant="outline" className="border-blue-500/50 text-white bg-blue-500/10 text-xs">
                              {mapData.map_type || 'network'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={isDrawing ? "default" : "outline"}
                            onClick={() => setIsDrawing(!isDrawing)}
                            className={isDrawing ? "bg-gradient-to-r from-red-600 to-orange-700 text-white" : "text-white border-blue-500/50"}
                          >
                            <Crosshair className="w-4 h-4 mr-2" />
                            {isDrawing ? "Drawing" : "View"}
                          </Button>
                          {image && (
                            <>
                              <Button size="sm" variant="outline" onClick={exportData} className="text-white border-blue-500/50">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={saveMap}
                                disabled={saveMapMutation.isPending}
                                className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                {saveMapMutation.isPending ? 'Saving...' : 'Save'}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!image ? (
                        <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-12 text-center backdrop-blur-md">
                          <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                          <p className="text-white mb-4">Upload security diagram or infrastructure map</p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="max-w-xs mx-auto bg-blue-900/30 border-blue-500/30 text-white placeholder:text-white/50"
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <canvas
                            ref={canvasRef}
                            onClick={handleCanvasClick}
                            className="w-full border border-blue-500/30 rounded-lg cursor-crosshair backdrop-blur-sm"
                            style={{ maxHeight: "600px", objectFit: "contain" }}
                          />
                          {isDrawing && (
                            <div className="absolute top-4 left-4 bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-lg p-3 text-sm text-white">
                              <Target className="w-4 h-4 inline mr-2" />
                              Click to mark security zones
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Map Configuration */}
                  {image && (
                    <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                      <CardHeader>
                        <CardTitle className="text-white text-sm">Map Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Map Name</Label>
                            <Input
                              value={mapData.name}
                              onChange={(e) => setMapData({ ...mapData, name: e.target.value })}
                              placeholder="Server Room Alpha"
                              className="bg-blue-900/30 border-blue-500/30 text-white placeholder:text-white/50"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Map Type</Label>
                            <Select
                              value={mapData.map_type}
                              onValueChange={(value) => setMapData({ ...mapData, map_type: value })}
                            >
                              <SelectTrigger className="bg-blue-900/30 border-blue-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-blue-900/90 backdrop-blur-md border-blue-500/30">
                                <SelectItem value="network" className="text-white">Network</SelectItem>
                                <SelectItem value="physical" className="text-white">Physical</SelectItem>
                                <SelectItem value="infrastructure" className="text-white">Infrastructure</SelectItem>
                                <SelectItem value="perimeter" className="text-white">Perimeter</SelectItem>
                                <SelectItem value="data-flow" className="text-white">Data Flow</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label className="text-white">Description</Label>
                          <Textarea
                            value={mapData.description}
                            onChange={(e) => setMapData({ ...mapData, description: e.target.value })}
                            placeholder="Detailed map description..."
                            className="bg-blue-900/30 border-blue-500/30 text-white placeholder:text-white/50"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label className="text-white">Overall Threat Level</Label>
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            {["low", "medium", "high", "critical"].map((level) => (
                              <Button
                                key={level}
                                size="sm"
                                variant={mapData.threat_level === level ? "default" : "outline"}
                                onClick={() => setMapData({ ...mapData, threat_level: level })}
                                className={
                                  mapData.threat_level === level
                                    ? `bg-gradient-to-r ${
                                        level === "low" ? "from-green-600 to-emerald-700" :
                                        level === "medium" ? "from-yellow-600 to-orange-700" :
                                        level === "high" ? "from-orange-600 to-red-700" :
                                        "from-red-600 to-red-800"
                                      } text-white`
                                    : "text-white border-blue-500/50"
                                }
                              >
                                {level}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Hotspot Editor */}
                  {selectedHotspot !== null && (
                    <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">Zone #{selectedHotspot + 1}</CardTitle>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={deleteHotspot}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-white">Zone Name</Label>
                          <Input
                            value={hotspotForm.name}
                            onChange={(e) => setHotspotForm({ ...hotspotForm, name: e.target.value })}
                            className="bg-blue-900/30 border-blue-500/30 text-white placeholder:text-white/50"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Description</Label>
                          <Textarea
                            value={hotspotForm.description}
                            onChange={(e) => setHotspotForm({ ...hotspotForm, description: e.target.value })}
                            className="bg-blue-900/30 border-blue-500/30 text-white placeholder:text-white/50"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label className="text-white">Severity</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {["low", "medium", "high", "critical"].map((level) => (
                              <Button
                                key={level}
                                size="sm"
                                variant={hotspotForm.severity === level ? "default" : "outline"}
                                onClick={() => setHotspotForm({ ...hotspotForm, severity: level })}
                                className={
                                  hotspotForm.severity === level
                                    ? `bg-gradient-to-r ${
                                        level === "low" ? "from-green-600 to-emerald-700" :
                                        level === "medium" ? "from-yellow-600 to-orange-700" :
                                        level === "high" ? "from-orange-600 to-red-700" :
                                        "from-red-600 to-red-800"
                                      } text-white`
                                    : "text-white border-blue-500/50"
                                }
                              >
                                {level}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-white">Status</Label>
                          <Select
                            value={hotspotForm.status}
                            onValueChange={(value) => setHotspotForm({ ...hotspotForm, status: value })}
                          >
                            <SelectTrigger className="bg-blue-900/30 border-blue-500/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-blue-900/90 backdrop-blur-md border-blue-500/30">
                              <SelectItem value="active" className="text-white">Active</SelectItem>
                              <SelectItem value="monitoring" className="text-white">Monitoring</SelectItem>
                              <SelectItem value="resolved" className="text-white">Resolved</SelectItem>
                              <SelectItem value="escalated" className="text-white">Escalated</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white">Reference URL</Label>
                          <Input
                            value={hotspotForm.url}
                            onChange={(e) => setHotspotForm({ ...hotspotForm, url: e.target.value })}
                            placeholder="https://..."
                            className="bg-blue-900/30 border-blue-500/30 text-white placeholder:text-white/50"
                          />
                        </div>
                        <Button
                          onClick={updateHotspot}
                          className="w-full bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-500/50"
                        >
                          Update Zone
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Hotspot List */}
                  {hotspots.length > 0 && (
                    <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                      <CardHeader>
                        <CardTitle className="text-white">Security Zones ({hotspots.length})</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                        {hotspots.map((hotspot, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedHotspot(index);
                              setHotspotForm({
                                name: hotspot.name,
                                description: hotspot.description,
                                severity: hotspot.severity,
                                url: hotspot.url || "",
                                status: hotspot.status || "active"
                              });
                            }}
                            className={`p-3 rounded-lg border cursor-pointer transition-all backdrop-blur-md ${
                              selectedHotspot === index
                                ? "border-blue-500 bg-blue-500/20"
                                : "border-blue-500/30 hover:border-blue-500/50 bg-blue-900/30"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-white">#{index + 1} {hotspot.name}</span>
                              <div className="flex gap-1">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    hotspot.severity === "low" ? "border-green-500 text-green-400 bg-green-500/10" :
                                    hotspot.severity === "medium" ? "border-yellow-500 text-yellow-400 bg-yellow-500/10" :
                                    hotspot.severity === "high" ? "border-orange-500 text-orange-400 bg-orange-500/10" :
                                    "border-red-500 text-red-400 bg-red-500/10"
                                  }`}
                                >
                                  {hotspot.severity}
                                </Badge>
                                <Badge variant="outline" className="border-blue-500/50 text-white bg-blue-500/10 text-xs">
                                  {hotspot.status || 'active'}
                                </Badge>
                              </div>
                            </div>
                            {hotspot.description && (
                              <p className="text-sm text-white/80">{hotspot.description}</p>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="threats">
              <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Active Threat Monitor</CardTitle>
                </CardHeader>
                <CardContent>
                  {threats.length === 0 ? (
                    <div className="text-center py-12 text-white/60">
                      <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No threats detected. System secure.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {threats.slice(0, 20).map((threat) => (
                        <div
                          key={threat.id}
                          className="p-4 bg-blue-900/30 backdrop-blur-md border border-blue-500/20 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-white">{threat.hotspot_name}</h4>
                              <p className="text-sm text-white/80">{threat.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge
                                variant="outline"
                                className={`${
                                  threat.severity === "critical" ? "border-red-500 text-red-400 bg-red-500/10" :
                                  threat.severity === "high" ? "border-orange-500 text-orange-400 bg-orange-500/10" :
                                  threat.severity === "medium" ? "border-yellow-500 text-yellow-400 bg-yellow-500/10" :
                                  "border-green-500 text-green-400 bg-green-500/10"
                                }`}
                              >
                                {threat.severity}
                              </Badge>
                              <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10">
                                {threat.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-white/60">
                            <span>{threat.threat_type.replace('_', ' ')}</span>
                            <span>{new Date(threat.created_date).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maps">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {maps.map((map) => (
                  <Card key={map.id} className="bg-blue-900/20 backdrop-blur-md border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={map.image_url}
                        alt={map.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="outline"
                          className={`${
                            map.threat_level === "critical" ? "border-red-500 bg-red-500/20 text-red-400" :
                            map.threat_level === "high" ? "border-orange-500 bg-orange-500/20 text-orange-400" :
                            map.threat_level === "medium" ? "border-yellow-500 bg-yellow-500/20 text-yellow-400" :
                            "border-green-500 bg-green-500/20 text-green-400"
                          }`}
                        >
                          {map.threat_level}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-white mb-2">{map.name}</h3>
                      <p className="text-sm text-white/80 mb-3">{map.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline" className="border-blue-500/50 text-white bg-blue-500/10">
                          {map.map_type}
                        </Badge>
                        <span className="text-white/60">{map.hotspots?.length || 0} zones</span>
                      </div>
                      <Button
                        onClick={() => loadMap(map)}
                        className="w-full mt-3 bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-500/50"
                        size="sm"
                      >
                        Load Map
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Threat Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['critical', 'high', 'medium', 'low'].map((severity) => {
                        const count = threats.filter(t => t.severity === severity).length;
                        const percentage = threats.length > 0 ? (count / threats.length) * 100 : 0;
                        return (
                          <div key={severity}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white capitalize">{severity}</span>
                              <span className="text-white/60">{count}</span>
                            </div>
                            <div className="w-full bg-blue-900/30 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  severity === 'critical' ? 'bg-red-500' :
                                  severity === 'high' ? 'bg-orange-500' :
                                  severity === 'medium' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">System Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Maps:</span>
                      <span className="font-bold text-white">{maps.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Hotspots:</span>
                      <span className="font-bold text-white">
                        {maps.reduce((sum, map) => sum + (map.hotspots?.length || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Active Threats:</span>
                      <span className="font-bold text-red-400">{activeThreatCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Critical Threats:</span>
                      <span className="font-bold text-red-400">{criticalThreatCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Resolved Threats:</span>
                      <span className="font-bold text-green-400">
                        {threats.filter(t => t.status === 'resolved').length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </FreeTrialGuard>
  );
}