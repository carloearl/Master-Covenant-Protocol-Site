import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save, Hash, Search, Trash2, Edit } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import ImageCanvas from "@/components/studio/ImageCanvas";
import HotspotEditor from "@/components/studio/HotspotEditor";
import HotspotList from "@/components/studio/HotspotList";
import VerificationPanel from "@/components/studio/VerificationPanel";

export default function InteractiveImageStudio() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
        } else {
          await base44.auth.redirectToLogin();
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      
      const uploadResult = await base44.integrations.Core.UploadFile({ file });
      
      const image = await base44.entities.InteractiveImage.create({
        name: file.name,
        fileUrl: uploadResult.file_url,
        width: 0,
        height: 0,
        status: 'draft',
        ownerEmail: user.email
      });
      
      setImageId(image.id);
      setUploadedImage(uploadResult.file_url);
      setHotspots([]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHotspots = async () => {
    if (!imageId) return;

    try {
      setSaving(true);
      const response = await base44.functions.invoke('saveImageHotspots', {
        imageId,
        hotspots
      });

      if (response.data.success) {
        alert(`Saved ${response.data.count} hotspots successfully!`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save hotspots");
    } finally {
      setSaving(false);
    }
  };

  const handleFinalize = async () => {
    if (!imageId) return;

    try {
      setFinalizing(true);
      const response = await base44.functions.invoke('finalizeInteractiveImage', {
        imageId
      });

      if (response.data.success) {
        alert(`Image finalized!\n\nLog ID: ${response.data.logId}\nHash: ${response.data.hash.substring(0, 16)}...`);
        setActiveTab("verify");
      }
    } catch (error) {
      console.error("Finalize error:", error);
      alert("Failed to finalize image");
    } finally {
      setFinalizing(false);
    }
  };

  const handleAddHotspot = (hotspot) => {
    setHotspots([...hotspots, { ...hotspot, id: Date.now().toString() }]);
  };

  const handleUpdateHotspot = (updatedHotspot) => {
    setHotspots(hotspots.map(h => h.id === updatedHotspot.id ? updatedHotspot : h));
    setSelectedHotspot(updatedHotspot);
  };

  const handleDeleteHotspot = (hotspotId) => {
    setHotspots(hotspots.filter(h => h.id !== hotspotId));
    if (selectedHotspot?.id === hotspotId) {
      setSelectedHotspot(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <SEOHead
        title="Interactive Image Studio | GlyphLock Security"
        description="Create cryptographically secured interactive images with hotspots, hashing, and verification."
      />

      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Interactive Image <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Studio</span>
          </h1>
          <p className="text-white/70">Create secure, interactive, cryptographically verified images</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-royal border-blue-500/30">
            <TabsTrigger value="editor" className="text-white">Editor</TabsTrigger>
            <TabsTrigger value="verify" className="text-white">Verify</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            {!uploadedImage ? (
              <Card className="glass-royal border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Upload Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-blue-500/50 rounded-lg p-12 text-center">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                    <p className="text-white/70 mb-4">Upload an image to begin</p>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white hover:from-blue-700 hover:to-blue-800 transition-all">
                        Choose File
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <Card className="glass-royal border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        Canvas
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveHotspots}
                            disabled={saving || hotspots.length === 0}
                            className="bg-blue-600 hover:bg-blue-700"
                            size="sm"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            onClick={handleFinalize}
                            disabled={finalizing || hotspots.length === 0}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <Hash className="w-4 h-4 mr-2" />
                            {finalizing ? "Finalizing..." : "Finalize"}
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ImageCanvas
                        imageUrl={uploadedImage}
                        hotspots={hotspots}
                        selectedHotspot={selectedHotspot}
                        onAddHotspot={handleAddHotspot}
                        onSelectHotspot={setSelectedHotspot}
                      />
                    </CardContent>
                  </Card>

                  <HotspotList
                    hotspots={hotspots}
                    selectedHotspot={selectedHotspot}
                    onSelect={setSelectedHotspot}
                    onDelete={handleDeleteHotspot}
                  />
                </div>

                <div>
                  <HotspotEditor
                    hotspot={selectedHotspot}
                    onUpdate={handleUpdateHotspot}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="verify">
            <VerificationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}