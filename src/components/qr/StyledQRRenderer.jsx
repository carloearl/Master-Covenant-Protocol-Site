import React, { useEffect, useRef, useState, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';

/**
 * StyledQRRenderer - Local QR code generation with full styling support
 * Uses qr-code-styling library for advanced customization
 */
export default function StyledQRRenderer({
  text = 'https://glyphlock.io',
  size = 300,
  customization = {},
  onDataUrlReady = null,
  className = '',
  showDownload = false
}) {
  const qrRef = useRef(null);
  const qrCodeRef = useRef(null);
  const [dataUrl, setDataUrl] = useState(null);
  const [isRendering, setIsRendering] = useState(false);

  // Map our dot styles to qr-code-styling dot types
  // qr-code-styling supports: 'square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'
  const getDotType = (style) => {
    const mapping = {
      'square': 'square',
      'rounded': 'rounded',
      'circle': 'dots',
      'diamond': 'classy',
      'pixel': 'square',
      'mosaic': 'classy',
      'microdots': 'dots',
      'star': 'classy-rounded',
      'hex': 'classy',
      'bevel': 'extra-rounded',
      'liquid': 'extra-rounded'
    };
    return mapping[style] || 'square';
  };

  // Map our eye styles to qr-code-styling corner types
  const getCornerSquareType = (style) => {
    const mapping = {
      'square': 'square',
      'circular': 'dot',
      'rounded': 'extra-rounded',
      'diamond': 'square',
      'frame-thick': 'square',
      'frame-thin': 'square',
      'neon-ring': 'dot',
      'orbital': 'dot',
      'galaxy': 'dot'
    };
    return mapping[style] || 'square';
  };

  const getCornerDotType = (style) => {
    const mapping = {
      'square': 'square',
      'circular': 'dot',
      'rounded': 'dot',
      'diamond': 'square',
      'frame-thick': 'square',
      'frame-thin': 'square',
      'neon-ring': 'dot',
      'orbital': 'dot',
      'galaxy': 'dot'
    };
    return mapping[style] || 'square';
  };

  // Get margin value from preset
  const getMarginValue = (marginPreset) => {
    const margins = {
      'none': 0,
      'small': 10,
      'medium': 20,
      'large': 40
    };
    return margins[marginPreset] || 20;
  };

  // Build QR options from customization
  const buildQROptions = useCallback(() => {
    const {
      dotStyle = 'square',
      eyeStyle = 'square',
      foregroundColor = '#000000',
      backgroundColor = '#ffffff',
      gradient = {},
      eyeColors = {},
      logo = {},
      background = {},
      qrShape = {}
    } = customization;

    // Base options
    const options = {
      width: size,
      height: size,
      type: 'canvas',
      data: text || 'https://glyphlock.io',
      margin: getMarginValue(qrShape?.margin),
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H'
      },
      dotsOptions: {
        type: getDotType(dotStyle),
        color: foregroundColor
      },
      cornersSquareOptions: {
        type: getCornerSquareType(eyeStyle),
        color: eyeColors?.topLeft?.outer || foregroundColor
      },
      cornersDotOptions: {
        type: getCornerDotType(eyeStyle),
        color: eyeColors?.topLeft?.inner || foregroundColor
      },
      backgroundOptions: {
        color: background?.type === 'solid' 
          ? (background?.color || '#ffffff')
          : '#ffffff'
      }
    };

    // Apply gradient to dots if enabled
    if (gradient?.enabled) {
      const gradientColors = [
        { offset: 0, color: gradient.color1 || '#000000' },
        { offset: 0.5, color: gradient.color2 || '#3B82F6' },
        { offset: 1, color: gradient.color3 || '#8B5CF6' }
      ];

      // Add color4 and color5 if present
      if (gradient.color4) {
        gradientColors.push({ offset: 0.75, color: gradient.color4 });
      }
      if (gradient.color5) {
        gradientColors.push({ offset: 1, color: gradient.color5 });
      }

      options.dotsOptions.gradient = {
        type: gradient.type === 'radial' ? 'radial' : 'linear',
        rotation: (gradient.angle || 0) * (Math.PI / 180),
        colorStops: gradientColors.sort((a, b) => a.offset - b.offset)
      };
    }

    // Apply background gradient if enabled
    if (background?.type === 'gradient') {
      options.backgroundOptions = {
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: background.gradientColor1 || '#ffffff' },
            { offset: 1, color: background.gradientColor2 || '#e5e7eb' }
          ]
        }
      };
    }

    // Add logo/image if present
    if (logo?.url) {
      options.image = logo.url;
      options.imageOptions = {
        crossOrigin: 'anonymous',
        margin: logo?.border ? 5 : 0,
        imageSize: (logo?.size || 20) / 100,
        hideBackgroundDots: true
      };
    }

    return options;
  }, [text, size, customization]);

  // Create/update QR code
  useEffect(() => {
    if (!text) return;

    setIsRendering(true);
    const options = buildQROptions();

    // Create new QR code instance
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling(options);
    } else {
      qrCodeRef.current.update(options);
    }

    // Clear and append to DOM
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCodeRef.current.append(qrRef.current);
    }

    // Generate data URL for external use
    const generateDataUrl = async () => {
      try {
        const blob = await qrCodeRef.current.getRawData('png');
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const url = reader.result;
            setDataUrl(url);
            if (onDataUrlReady) {
              onDataUrlReady(url);
            }
          };
          reader.readAsDataURL(blob);
        }
      } catch (err) {
        console.error('Error generating QR data URL:', err);
      } finally {
        setIsRendering(false);
      }
    };

    // Small delay to ensure canvas is rendered
    const timer = setTimeout(generateDataUrl, 100);
    return () => clearTimeout(timer);
  }, [text, buildQROptions, onDataUrlReady]);

  // Download handlers
  const downloadPNG = useCallback(async () => {
    if (qrCodeRef.current) {
      await qrCodeRef.current.download({ name: 'qr-code', extension: 'png' });
    }
  }, []);

  const downloadSVG = useCallback(async () => {
    if (qrCodeRef.current) {
      await qrCodeRef.current.download({ name: 'qr-code', extension: 'svg' });
    }
  }, []);

  // Expose download methods and dataUrl via ref
  const getDataUrl = useCallback(() => dataUrl, [dataUrl]);
  const getBlob = useCallback(async (format = 'png') => {
    if (qrCodeRef.current) {
      return await qrCodeRef.current.getRawData(format);
    }
    return null;
  }, []);

  return (
    <div className={`styled-qr-renderer ${className}`}>
      <div 
        ref={qrRef} 
        className="qr-canvas-container flex items-center justify-center"
        style={{
          borderRadius: customization?.qrShape?.type === 'circle-qr' ? '50%' 
            : customization?.qrShape?.type === 'squircle' ? '20%' 
            : customization?.qrShape?.type === 'round-frame' ? '12px' : '0',
          overflow: 'hidden'
        }}
      />
      
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {showDownload && dataUrl && (
        <div className="flex gap-2 mt-4 justify-center">
          <button
            onClick={downloadPNG}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Download PNG
          </button>
          <button
            onClick={downloadSVG}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Download SVG
          </button>
        </div>
      )}
    </div>
  );
}

// Export utility functions for external use
export const createQRDataUrl = async (text, size, customization) => {
  return new Promise((resolve, reject) => {
    try {
      const qr = new QRCodeStyling({
        width: size,
        height: size,
        data: text,
        dotsOptions: {
          color: customization?.foregroundColor || '#000000',
          type: 'square'
        },
        backgroundOptions: {
          color: customization?.backgroundColor || '#ffffff'
        }
      });

      qr.getRawData('png').then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      reject(err);
    }
  });
};