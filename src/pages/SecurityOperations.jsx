import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, MapPin, Crosshair, Download, Trash2, Save, AlertTriangle, 
  Shield, Eye, Activity, BarChart3, Bell, Search, Filter, FileText,
  CheckCircle2, XCircle, Clock, TrendingUp, Mail
} from "lucide-react";
import FreeTrialGuard from "@/components/FreeTrialGuard";
import LiveThreatMonitor from "@/components/security/LiveThreatMonitor";

export default function SecurityOperations() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("surveillance");
  
  // Mapper state
  const [image, setImage] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapConfig, setMapConfig] = useState({
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

  // Surveillance state
  const [threatFilter, setThreatFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [alertRecipients, setAlertRecipients] = useState("");

  // Queries with auto-refresh
  const { data: maps = [], isLoading: mapsLoading } = useQuery({
    queryKey: ['hotzone-maps'],
    queryFn: () => base44.entities.HotzoneMap.list('-updated_date', 50),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: threats = [], isLoading: threatsLoading, refetch: refetchThreats } = useQuery({
    queryKey: ['hotzone-threats'],
    queryFn: () => base44.entities.HotzoneThreat.list('-updated_date', 100),
    refetchInterval: 5000 // Refresh every 5 seconds for live monitoring
  });

  // Mutations
  const saveMapMutation = useMutation({
    mutationFn: async (mapData) => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: mapData.imageFile });
      
      return base44.entities.HotzoneMap.create({
        name: mapData.name,
        description: mapData.description,
        image_url: file_url,
        image_width: image?.width || 800,
        image_height: image?.height || 600,
        hotspots: hotspots,
        map_type: mapData.map_type,
        status: "active",
        threat_level: mapData.threat_level
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['hotzone-maps']);
      alert('Map saved successfully!');
    },
    onError: (error) => {
      alert(`Failed to save map: ${error.message}`);
    }
  });

  const detectThreatMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('detectThreat', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['hotzone-threats']);
      alert('Threat analysis complete!');
    },
    onError: (error) => {
      alert(`Threat detection failed: ${error.message}`);
    }
  });

  const sendAlertMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('alertManagement', data),
    onSuccess: () => {
      alert('Alerts sent successfully!');
      setAlertRecipients("");
    },
    onError: (error) => {
      alert(`Failed to send alerts: ${error.message}`);
    }
  });

  const generateReportMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('generateSecurityReport', data),
    onSuccess: (response) => {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-report-${Date.now()}.json`;
      a.click();
    },
    onError: (error) => {
      alert(`Failed to generate report: ${error.message}`);
    }
  });

  // Canvas functions
  useEffect(() => {
    if (image && canvasRef.current) {
      drawCanvas();
    }
  }, [image, hotspots, selectedHotspot]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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

      ctx.beginPath();
      ctx.arc(hotspot.x, hotspot.y, isSelected ? 25 : 20, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = isSelected ? 4 : 3;
      ctx.stroke();
      ctx.fillStyle = color + "40";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(hotspot.x - 15, hotspot.y);
      ctx.lineTo(hotspot.x + 15, hotspot.y);
      ctx.moveTo(hotspot.x, hotspot.y - 15);
      ctx.lineTo(hotspot.x, hotspot.y + 15);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = "bold 14px Arial";
      ctx.fillText(`#${index + 1}`, hotspot.x + 30, hotspot.y + 5);
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
        name: `Hotspot ${hotspots.length + 1}`,
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
    setHotspotForm({ name: "", description: "", severity: "medium", url: "", status: "active" });
  };

  const handleSaveMap = () => {
    if (!image || !mapConfig.name) {
      alert('Please upload an image and provide a map name');
      return;
    }

    canvasRef.current.toBlob((blob) => {
      saveMapMutation.mutate({
        ...mapConfig,
        imageFile: blob
      });
    });
  };

  const loadMap = (map) => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setHotspots(map.hotspots || []);
      setMapConfig({
        name: map.name,
        description: map.description,
        map_type: map.map_type,
        threat_level: map.threat_level
      });
    };
    img.src = map.image_url;
  };

  const filteredThreats = threats.filter(threat => {
    const matchesFilter = threatFilter === 'all' || threat.severity === threatFilter;
    const matchesSearch = !searchQuery || 
      threat.hotspot_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: threats.length,
    critical: threats.filter(t => t.severity === 'critical').length,
    high: threats.filter(t => t.severity === 'high').length,
    resolved: threats.filter(t => t.resolved).length,
    active_maps: maps.length
  };

  return (
    <FreeTrialGuard serviceName="HSSS">
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="border-red-500/50 bg-red-500/10 text-red-400 mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Hybrid Security Surveillance System
              </Badge>
              <h1 className="text-5xl font-bold mb-4">
                Security <span className="bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">Operations Center</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Real-time threat monitoring with AI detection and instant response capabilities
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="pt-6 text-center">
                  <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-xs text-gray-400">Total Threats</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="pt-6 text-center">
                  <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.critical}</div>
                  <div className="text-xs text-gray-400">Critical</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.high}</div>
                  <div className="text-xs text-gray-400">High Priority</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="pt-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.resolved}</div>
                  <div className="text-xs text-gray-400">Resolved</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="pt-6 text-center">
                  <MapPin className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats.active_maps}</div>
                  <div className="text-xs text-gray-400">Active Maps</div>
                </CardContent>
              </Card>
            </div>

            {/* Live Threat Monitor */}
            <div className="mb-8">
              <LiveThreatMonitor threats={threats} onRefresh={refetchThreats} />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-gray-900 mb-8">
                <TabsTrigger value="surveillance">
                  <Eye className="w-4 h-4 mr-2" />
                  Surveillance
                </TabsTrigger>
                <TabsTrigger value="mapper">
                  <MapPin className="w-4 h-4 mr-2" />
                  Mapper
                </TabsTrigger>
                <TabsTrigger value="maps">
                  <Save className="w-4 h-4 mr-2" />
                  Saved Maps
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="surveillance">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-gray-900 border-gray-800">
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Search threats..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <Select value={threatFilter} onValueChange={setThreatFilter}>
                            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="all">All Severity</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      {filteredThreats.map((threat) => (
                        <Card 
                          key={threat.id} 
                          className={`bg-gray-900 border-gray-800 cursor-pointer transition-all ${
                            selectedThreat?.id === threat.id ? 'border-blue-500' : 'hover:border-gray-700'
                          }`}
                          onClick={() => setSelectedThreat(threat)}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={
                                    threat.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                    threat.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                    threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-green-500/20 text-green-400'
                                  }>
                                    {threat.severity}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {threat.threat_type}
                                  </Badge>
                                  {threat.resolved && (
                                    <Badge className="bg-green-500/20 text-green-400">
                                      Resolved
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-semibold text-white text-lg">{threat.hotspot_name}</h3>
                                <p className="text-gray-400 text-sm mt-1">{threat.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  {new Date(threat.created_date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    {selectedThreat ? (
                      <Card className="bg-gray-900 border-gray-800 sticky top-24">
                        <CardHeader>
                          <CardTitle className="text-white">Threat Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-gray-400 text-xs">Location</Label>
                            <p className="text-white font-semibold">{selectedThreat.hotspot_name}</p>
                          </div>
                          <div>
                            <Label className="text-gray-400 text-xs">Type</Label>
                            <p className="text-white">{selectedThreat.threat_type}</p>
                          </div>
                          <div>
                            <Label className="text-gray-400 text-xs">Severity</Label>
                            <Badge className={
                              selectedThreat.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                              selectedThreat.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              selectedThreat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }>
                              {selectedThreat.severity}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-gray-400 text-xs">Status</Label>
                            <p className="text-white">{selectedThreat.status}</p>
                          </div>
                          <div>
                            <Label className="text-gray-400 text-xs">Detection Method</Label>
                            <p className="text-white">{selectedThreat.detection_method}</p>
                          </div>
                          
                          <div className="pt-4 border-t border-gray-800 space-y-3">
                            <div>
                              <Label className="text-white text-sm mb-2 block">Send Alert</Label>
                              <Input
                                placeholder="email1@example.com, email2@example.com"
                                value={alertRecipients}
                                onChange={(e) => setAlertRecipients(e.target.value)}
                                className="bg-gray-800 border-gray-700 text-white mb-2"
                              />
                              <Button
                                onClick={() => {
                                  const recipients = alertRecipients.split(',').map(e => e.trim()).filter(Boolean);
                                  if (recipients.length > 0) {
                                    sendAlertMutation.mutate({
                                      threat_id: selectedThreat.id,
                                      recipients: recipients,
                                      alert_type: 'security_incident',
                                      severity: selectedThreat.severity
                                    });
                                  }
                                }}
                                disabled={sendAlertMutation.isPending || !alertRecipients}
                                className="w-full bg-red-600 text-white"
                                size="sm"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Alert
                              </Button>
                            </div>
                            
                            <Button
                              onClick={() => generateReportMutation.mutate({ map_id: selectedThreat.map_id })}
                              disabled={generateReportMutation.isPending}
                              variant="outline"
                              className="w-full border-blue-500/50 text-blue-400"
                              size="sm"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Generate Report
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="pt-6 text-center">
                          <Eye className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">Select a threat to view details</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mapper">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">Security Map Canvas</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={isDrawing ? "default" : "outline"}
                              onClick={() => setIsDrawing(!isDrawing)}
                              className={isDrawing ? "bg-red-600 text-white" : "text-white border-gray-700"}
                            >
                              <Crosshair className="w-4 h-4 mr-2" />
                              {isDrawing ? "Drawing" : "View"}
                            </Button>
                            {image && (
                              <Button 
                                size="sm" 
                                onClick={handleSaveMap}
                                disabled={saveMapMutation.isPending}
                                className="bg-blue-600 text-white"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save Map
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {!image ? (
                          <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
                            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-white mb-4">Upload an image to start mapping</p>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="max-w-xs mx-auto bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        ) : (
                          <div className="relative w-full">
                            <canvas
                              ref={canvasRef}
                              onClick={handleCanvasClick}
                              className="w-full h-auto max-h-[600px] border border-gray-700 rounded-lg cursor-crosshair"
                            />
                            {isDrawing && (
                              <div className="absolute top-4 left-4 bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-lg p-3 text-sm text-white">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Click to place hotspots
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    {image && (
                      <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-white text-sm">Map Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-white">Map Name *</Label>
                            <Input
                              value={mapConfig.name}
                              onChange={(e) => setMapConfig({...mapConfig, name: e.target.value})}
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="Network Infrastructure Map"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Description</Label>
                            <Textarea
                              value={mapConfig.description}
                              onChange={(e) => setMapConfig({...mapConfig, description: e.target.value})}
                              className="bg-gray-800 border-gray-700 text-white"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label className="text-white">Map Type</Label>
                            <Select
                              value={mapConfig.map_type}
                              onValueChange={(value) => setMapConfig({...mapConfig, map_type: value})}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="network">Network</SelectItem>
                                <SelectItem value="physical">Physical</SelectItem>
                                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                                <SelectItem value="perimeter">Perimeter</SelectItem>
                                <SelectItem value="data-flow">Data Flow</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedHotspot !== null && (
                      <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-sm">Edit Hotspot #{selectedHotspot + 1}</CardTitle>
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
                            <Label className="text-white">Name</Label>
                            <Input
                              value={hotspotForm.name}
                              onChange={(e) => setHotspotForm({...hotspotForm, name: e.target.value})}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Description</Label>
                            <Textarea
                              value={hotspotForm.description}
                              onChange={(e) => setHotspotForm({...hotspotForm, description: e.target.value})}
                              className="bg-gray-800 border-gray-700 text-white"
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
                                  onClick={() => setHotspotForm({...hotspotForm, severity: level})}
                                  className={
                                    hotspotForm.severity === level
                                      ? `${level === "critical" ? "bg-red-600" : level === "high" ? "bg-orange-600" : level === "medium" ? "bg-yellow-600" : "bg-green-600"} text-white`
                                      : "text-white border-gray-700"
                                  }
                                >
                                  {level.charAt(0).toUpperCase() + level.slice(1)}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <Button
                            onClick={updateHotspot}
                            className="w-full bg-blue-600 text-white"
                          >
                            Update Hotspot
                          </Button>
                          <Button
                            onClick={() => {
                              detectThreatMutation.mutate({
                                map_id: "current",
                                hotspot_data: { ...hotspots[selectedHotspot], ...hotspotForm },
                                auto_analyze: true
                              });
                            }}
                            disabled={detectThreatMutation.isPending}
                            variant="outline"
                            className="w-full border-purple-500/50 text-purple-400"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            AI Threat Analysis
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="maps">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {maps.map((map) => (
                    <Card key={map.id} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer">
                      <CardContent className="pt-6">
                        <img 
                          src={map.image_url} 
                          alt={map.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold text-white text-lg mb-2">{map.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{map.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{map.map_type}</Badge>
                          <Button
                            size="sm"
                            onClick={() => {
                              loadMap(map);
                              setActiveTab("mapper");
                            }}
                            className="bg-blue-600 text-white"
                          >
                            Load Map
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Threat Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-red-400">Critical</span>
                            <span className="text-white font-bold">{stats.critical}</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ width: `${stats.total > 0 ? (stats.critical / stats.total) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-orange-400">High</span>
                            <span className="text-white font-bold">{stats.high}</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full" 
                              style={{ width: `${stats.total > 0 ? (stats.high / stats.total) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Resolution Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-green-400 mb-2">
                          {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                        </div>
                        <p className="text-gray-400">
                          {stats.resolved} of {stats.total} threats resolved
                        </p>
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