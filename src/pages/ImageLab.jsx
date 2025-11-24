import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Layers, Image as ImageIcon, Database, Zap } from 'lucide-react';
import { toast } from 'sonner';
import PaywallGuard from '@/components/PaywallGuard';
import SEOHead from '@/components/SEOHead';
import {
  GlyphImageCard,
  GlyphImageButton,
  GlyphImageTypography,
  GlyphImageGradients,
  GlyphImageShadows,
} from '@/components/imageLab/design/GlyphImageDesignSystem';

// Tab Components
import GenerateTab from '@/components/imageLab/tabs/GenerateTab.jsx';
import InteractiveTab from '@/components/imageLab/tabs/InteractiveTab.jsx';
import GalleryTab from '@/components/imageLab/tabs/GalleryTab.jsx';

export default function ImageLab() {
  const [activeTab, setActiveTab] = useState('generate');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleImageGenerated = (image) => {
    setSelectedImage(image);
    toast.success('Image generated! Open Interactive tab to add hotspots.');
  };

  const handleImageSelected = (image) => {
    setSelectedImage(image);
    setActiveTab('interactive');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-white/70">Initializing GlyphLock Image Lab...</p>
        </div>
      </div>
    );
  }

  return (
    <PaywallGuard serviceName="Image Lab" requirePlan="professional">
      <SEOHead
        title="GlyphLock Image Lab | Generate & Secure Interactive Images"
        description="Military-grade AI image generation with cryptographic security, interactive hotspots, and steganographic protection. Create, secure, and verify visual assets."
        keywords="AI image generation, interactive images, steganography, secure media, GlyphLock, cryptographic images, hotspot editor"
        url="/image-lab"
      />

      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black relative">
        {/* Animated Cosmic Background */}
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-blue-500/5 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[150px] opacity-15 animate-pulse"></div>
        </div>

        {/* Header */}
        <div className="border-b border-cyan-500/20 bg-black/80 backdrop-blur-xl sticky top-0 z-50 shadow-2xl shadow-black/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col space-y-2">
                <h1 className={`${GlyphImageTypography.display.md} ${GlyphImageGradients.primaryText} flex items-center gap-3`}>
                  <Zap className="w-10 h-10 text-cyan-400 animate-pulse" />
                  GlyphLock Image Lab
                </h1>
                <p className="text-sm sm:text-base text-gray-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  AI generation, interactive hotspots, cryptographic security & verification
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <p className="text-xs text-cyan-400 font-semibold">Generate • Interact • Secure</p>
                </div>
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Premium Lab
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl relative z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Desktop Tabs - Horizontal */}
            <TabsList className="hidden lg:flex w-full mb-6 bg-gray-900/50 border border-gray-800 p-1">
              <TabsTrigger value="generate" className="flex-1 min-h-[44px] data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white">
                <ImageIcon className="w-4 h-4 mr-2" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="interactive" className="flex-1 min-h-[44px] data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white">
                <Layers className="w-4 h-4 mr-2" />
                Interactive
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex-1 min-h-[44px] data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white">
                <Database className="w-4 h-4 mr-2" />
                Gallery
              </TabsTrigger>
            </TabsList>

            {/* Mobile Tabs - Scrollable Pills */}
            <div className="lg:hidden mb-6 -mx-4 px-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { value: 'generate', icon: ImageIcon, label: 'Generate' },
                  { value: 'interactive', icon: Layers, label: 'Interactive' },
                  { value: 'gallery', icon: Database, label: 'Gallery' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all min-h-[44px] ${
                        activeTab === tab.value
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/50'
                          : 'bg-gray-900/50 text-gray-400 border border-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Tab */}
            <TabsContent value="generate">
              <GenerateTab
                user={user}
                onImageGenerated={handleImageGenerated}
              />
            </TabsContent>

            {/* Interactive Tab */}
            <TabsContent value="interactive">
              <InteractiveTab
                user={user}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
              />
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              <GalleryTab
                user={user}
                onImageSelect={handleImageSelected}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PaywallGuard>
  );
}