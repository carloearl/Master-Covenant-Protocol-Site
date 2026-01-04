import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Layers, Image as ImageIcon, Database, Zap, HelpCircle, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/shared/PageHeader';
import { useResponsive } from '@/components/hooks/useResponsive';

import SEOHead from '@/components/SEOHead';
import { injectSoftwareSchema } from '@/components/utils/seoHelpers';
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
import GuidedTour from '@/components/shared/GuidedTour.jsx';

export default function ImageLab() {
  const { isMobile, isTablet, breakpoint } = useResponsive();
  const [activeTab, setActiveTab] = useState('generate');
  const [user, setUser] = useState(null);
  const [userPrefs, setUserPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showTour, setShowTour] = useState(false);

  const TOUR_STEPS = [
    {
      id: 'welcome',
      title: 'Welcome to Image Lab',
      content: 'Create stunning AI art, secure it with steganography, and make it interactive with hotspots.',
      target: null,
    },
    {
      id: 'generate',
      title: 'Generate',
      content: 'Start here. Describe your vision, choose a style, and let our AI engine create it.',
      target: '[data-tour="generate-tab"]',
    },
    {
      id: 'interactive',
      title: 'Interactive',
      content: 'Add clickable hotspots to your images to link products, info, or other media.',
      target: '[data-tour="interactive-tab"]',
    },
    {
      id: 'gallery',
      title: 'Gallery',
      content: 'Manage your creations and secured assets in your personal vault.',
      target: '[data-tour="gallery-tab"]',
    },
    {
      id: 'shortcuts',
      title: 'Pro Tip: Shortcuts',
      content: 'Use Cmd/Ctrl + G to generate instantly, and Cmd/Ctrl + 1-3 to switch tabs.',
      target: null,
    }
  ];

  const HELP_STEPS = [
    { title: 'Enter a prompt', description: 'Describe what you want to create in detail' },
    { title: 'Select a style', description: 'Choose from 20+ artistic styles' },
    { title: 'Generate', description: 'Click Generate or press Cmd+G' },
    { title: 'Add hotspots', description: 'Click Interactive tab to add clickable zones' },
    { title: 'Share', description: 'Share your interactive image with a link' }
  ];

  const SHORTCUTS = [
    { action: 'Generate image', keys: 'Cmd/Ctrl + G' },
    { action: 'Enhance prompt', keys: 'Cmd/Ctrl + E' },
    { action: 'Generate tab', keys: 'Cmd/Ctrl + 1' },
    { action: 'Interactive tab', keys: 'Cmd/Ctrl + 2' },
    { action: 'Gallery tab', keys: 'Cmd/Ctrl + 3' }
  ];

  const TIPS = [
    'Be specific in your prompts for better results',
    'Use the AI Enhance button to improve your prompts',
    'Use reference images for style consistency',
    'AI detects objects automatically when you click',
    'Try batch generation for multiple variations',
    'Use style transfer to apply any style to existing images'
  ];

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
          
          // Fetch user preferences
          const prefs = await base44.entities.UserPreferences.filter({ created_by: userData.email });
          if (prefs && prefs.length > 0) {
            setUserPrefs(prefs[0]);
            if (prefs[0].toursSeen?.imageLab !== true && prefs[0].imageLabSettings?.showOnboarding !== false) {
              setShowTour(true);
            }
          } else {
            setShowTour(true);
          }
        } else {
          const tourSeen = localStorage.getItem('glyphlock_imagelab_tour_seen');
          if (!tourSeen) setShowTour(true);
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if ((e.metaKey || e.ctrlKey)) {
        if (e.key === '1') {
          e.preventDefault();
          setActiveTab('generate');
        } else if (e.key === '2') {
          e.preventDefault();
          setActiveTab('interactive');
        } else if (e.key === '3') {
          e.preventDefault();
          setActiveTab('gallery');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const cleanup = injectSoftwareSchema(
      'GlyphLock Image Lab',
      'AI image generation with cryptographic security, interactive hotspots, and steganographic protection',
      '/ImageLab',
      [
        'AI Image Generation',
        'Interactive Hotspot Editor',
        'Blockchain Verification',
        'Steganography Tools',
        'Secure Media Storage',
        'Style Transfer',
        'Background Removal',
        'Image Upscaling'
      ]
    );
    return cleanup;
  }, []);

  const handleTourComplete = async () => {
    setShowTour(false);
    if (user) {
      try {
        if (userPrefs) {
          await base44.entities.UserPreferences.update(userPrefs.id, {
            toursSeen: { ...userPrefs.toursSeen, imageLab: true },
            imageLabSettings: { ...userPrefs.imageLabSettings, showOnboarding: false }
          });
        } else {
          await base44.entities.UserPreferences.create({
            toursSeen: { imageLab: true },
            imageLabSettings: { showOnboarding: false }
          });
        }
      } catch (e) { console.error("Failed to save tour pref", e); }
    } else {
      localStorage.setItem('glyphlock_imagelab_tour_seen', 'true');
    }
  };

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
    <>
      <SEOHead
        title="GlyphLock Image Lab | Generate & Secure Interactive Images"
        description="Military-grade AI image generation with cryptographic security, interactive hotspots, and steganographic protection. Create, secure, and verify visual assets."
        keywords="AI image generation, interactive images, steganography, secure media, GlyphLock, cryptographic images, hotspot editor"
        url="/ImageLab"
      />

      <PageHeader
        title="GlyphLock Image Lab"
        subtitle="AI generation, interactive hotspots, cryptographic security"
        icon={Wand2}
        badge="Premium"
        backTo="Home"
        helpSteps={HELP_STEPS}
        shortcuts={SHORTCUTS}
        tips={TIPS}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTour(true)}
          className="text-purple-400 hover:text-white hover:bg-purple-500/20 gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Tour</span>
        </Button>
      </PageHeader>

      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black relative">
        {/* Cosmic Background */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-cyan-900/10 to-transparent pointer-events-none z-0" />
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 pointer-events-none z-0" />
        <div className="glyph-orb fixed top-20 right-20 opacity-20" style={{ animation: 'float-orb 8s ease-in-out infinite', background: 'radial-gradient(circle, rgba(6,182,212,0.3), rgba(59,130,246,0.2))' }}></div>
        <div className="glyph-orb fixed bottom-40 left-40 opacity-15" style={{ animation: 'float-orb 10s ease-in-out infinite', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(168,85,247,0.3), rgba(59,130,246,0.2))' }}></div>

        <div className={`container mx-auto ${isMobile ? 'px-3 py-4' : 'px-4 sm:px-6 lg:px-8 py-6 lg:py-8'} max-w-7xl relative z-10`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Desktop Tabs - Technical Segmented */}
            <TabsList className="hidden lg:flex w-full mb-6 bg-black/40 backdrop-blur-md border-t-2 border-b-2 border-cyan-500/20 p-0 h-auto rounded-none">
              <TabsTrigger 
                value="generate" 
                data-tour="generate-tab"
                className="flex-1 min-h-[56px] relative group border-r border-cyan-500/10 data-[state=active]:bg-gradient-to-b data-[state=active]:from-purple-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-purple-400 data-[state=active]:text-purple-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
              >
                <span className="mr-2 text-[10px] opacity-60">01</span>
                <ImageIcon className="w-4 h-4 mr-2" />
                <span>Generate</span>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-data-[state=active]:opacity-100 glyph-glow"></div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="interactive" 
                data-tour="interactive-tab"
                className="flex-1 min-h-[56px] relative group border-r border-cyan-500/10 data-[state=active]:bg-gradient-to-b data-[state=active]:from-cyan-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-cyan-400 data-[state=active]:text-cyan-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
              >
                <span className="mr-2 text-[10px] opacity-60">02</span>
                <Layers className="w-4 h-4 mr-2" />
                <span>Interactive</span>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-data-[state=active]:opacity-100 glyph-glow"></div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="gallery" 
                data-tour="gallery-tab"
                className="flex-1 min-h-[56px] relative group data-[state=active]:bg-gradient-to-b data-[state=active]:from-blue-500/20 data-[state=active]:to-transparent data-[state=active]:border-t-2 data-[state=active]:border-t-blue-400 data-[state=active]:text-blue-300 text-gray-500 hover:text-gray-300 transition-all font-mono text-xs uppercase tracking-widest rounded-none"
              >
                <span className="mr-2 text-[10px] opacity-60">03</span>
                <Database className="w-4 h-4 mr-2" />
                <span>Gallery</span>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-data-[state=active]:opacity-100 glyph-glow"></div>
              </TabsTrigger>
            </TabsList>

            {/* Mobile Tabs - Enhanced Touch Targets */}
            <div className="lg:hidden mb-6">
              <div className="flex gap-2 bg-black/80 backdrop-blur-md border-2 border-cyan-500/30 p-2 rounded-xl shadow-[0_0_30px_rgba(87,61,255,0.4)]">
                {[
                  { value: 'generate', icon: ImageIcon, label: 'Generate', num: '01' },
                  { value: 'interactive', icon: Layers, label: 'Interactive', num: '02' },
                  { value: 'gallery', icon: Database, label: 'Gallery', num: '03' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.value}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveTab(tab.value);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveTab(tab.value);
                      }}
                      className={`flex-1 flex flex-col items-center justify-center py-4 text-xs font-mono uppercase tracking-wider transition-all min-h-[60px] rounded-lg ${
                        activeTab === tab.value
                          ? 'bg-gradient-to-b from-purple-500/40 to-transparent text-purple-300 border-2 border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                          : 'text-gray-400 bg-white/5 hover:bg-white/10'
                      }`}
                      style={{
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent',
                        minWidth: '80px',
                        minHeight: '60px'
                      }}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Tab */}
            <TabsContent value="generate">
              <GenerateTab
                user={user}
                userPrefs={userPrefs}
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
      <GuidedTour 
        isOpen={showTour} 
        onComplete={handleTourComplete} 
        onSkip={handleTourComplete}
        steps={TOUR_STEPS}
      />
    </>
  );
}