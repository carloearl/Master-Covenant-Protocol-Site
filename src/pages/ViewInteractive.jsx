/**
 * ViewInteractive - Public viewer for shared interactive images
 * Supports different hotspot display styles (visible, glow, invisible, hover)
 */

import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, ExternalLink, MousePointer, Info } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { toast } from 'sonner';

const STYLE_CLASSES = {
  'visible-button': {
    base: 'border-2 border-cyan-400 bg-cyan-500/20 cursor-pointer',
    hover: 'hover:bg-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]',
    indicator: true
  },
  'glow-outline': {
    base: 'border-2 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer',
    hover: 'hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.7)]',
    indicator: false
  },
  'invisible-stego': {
    base: 'cursor-pointer',
    hover: 'hover:bg-white/5',
    indicator: false
  },
  'hover-reveal': {
    base: 'opacity-0 cursor-pointer transition-all duration-300',
    hover: 'hover:opacity-100 hover:bg-cyan-500/20 hover:border-2 hover:border-cyan-400',
    indicator: false
  }
};

export default function ViewInteractive() {
  const [image, setImage] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [style, setStyle] = useState('visible-button');
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Parse URL params
        const pathParts = window.location.pathname.split('/');
        const imageId = pathParts[pathParts.length - 1];
        const params = new URLSearchParams(window.location.search);
        const styleParam = params.get('style') || 'visible-button';
        const embedParam = params.get('embed') === 'true';

        setStyle(styleParam);
        setIsEmbed(embedParam);

        if (!imageId) {
          setError('No image ID provided');
          return;
        }

        // Fetch image data
        const images = await base44.entities.InteractiveImage.filter({ id: imageId });
        
        if (!images || images.length === 0) {
          setError('Image not found');
          return;
        }

        const imageData = images[0];
        setImage(imageData);
        setHotspots(imageData.hotspots || []);

      } catch (err) {
        console.error('Load error:', err);
        setError('Failed to load interactive image');
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, []);

  const handleHotspotClick = (hotspot) => {
    if (!hotspot.actionValue) {
      toast.info('This hotspot has no action configured');
      return;
    }

    switch (hotspot.actionType) {
      case 'openUrl':
        window.open(hotspot.actionValue, '_blank', 'noopener,noreferrer');
        break;
      case 'showModal':
        toast.info(hotspot.actionValue);
        break;
      case 'playAudio':
        const audio = new Audio(hotspot.actionValue);
        audio.play().catch(() => toast.error('Failed to play audio'));
        break;
      default:
        window.open(hotspot.actionValue, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-black flex items-center justify-center ${isEmbed ? '' : 'py-12'}`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading interactive image...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-black flex items-center justify-center ${isEmbed ? '' : 'py-12'}`}>
        <div className="text-center">
          <Info className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const styleConfig = STYLE_CLASSES[style] || STYLE_CLASSES['visible-button'];

  return (
    <>
      {!isEmbed && (
        <SEOHead
          title={`${image?.name || 'Interactive Image'} | GlyphLock`}
          description="View this interactive image with clickable hotspots"
          url={`/view-interactive/${image?.id}`}
        />
      )}

      <div className={`min-h-screen bg-gradient-to-br from-black via-slate-950 to-black ${isEmbed ? '' : 'py-8'}`}>
        <div className={`${isEmbed ? '' : 'container mx-auto px-4'}`}>
          {/* Header - hidden in embed mode */}
          {!isEmbed && (
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white mb-2">{image?.name}</h1>
              <p className="text-gray-400 text-sm">
                Click on highlighted areas to interact
              </p>
            </div>
          )}

          {/* Interactive Image Container */}
          <div className={`relative ${isEmbed ? 'w-full h-full' : 'max-w-5xl mx-auto'}`}>
            <div className="relative rounded-xl overflow-hidden bg-slate-900 shadow-2xl shadow-cyan-500/10">
              <img 
                src={image?.fileUrl} 
                alt={image?.name}
                className="w-full h-auto object-contain"
              />

              {/* Hotspots Overlay */}
              {hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  onClick={() => handleHotspotClick(hotspot)}
                  className={`absolute transition-all duration-200 ${styleConfig.base} ${styleConfig.hover}`}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    width: `${hotspot.width}%`,
                    height: `${hotspot.height}%`,
                  }}
                  title={hotspot.label}
                >
                  {/* Visible indicator for visible-button style */}
                  {styleConfig.indicator && hotspot.actionValue && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-cyan-500/90 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
                        <MousePointer className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-medium">{hotspot.label}</span>
                      </div>
                    </div>
                  )}

                  {/* Hover tooltip for other styles */}
                  {!styleConfig.indicator && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                        {hotspot.label}
                        {hotspot.actionValue && <ExternalLink className="w-3 h-3 inline ml-1" />}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend - hidden in embed */}
            {!isEmbed && hotspots.length > 0 && (
              <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-400">
                <span>{hotspots.length} interactive zone{hotspots.length !== 1 ? 's' : ''}</span>
                <span className="text-cyan-400">•</span>
                <span>Click to interact</span>
              </div>
            )}
          </div>

          {/* Powered by - hidden in embed */}
          {!isEmbed && (
            <div className="mt-8 text-center">
              <a 
                href="https://glyphlock.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-cyan-400 transition-colors"
              >
                Powered by GlyphLock Security
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}