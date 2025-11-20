import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

export default function CanvasPanel({ 
  imageUrl, 
  imageName,
  hotspots, 
  selectedHotspot, 
  activeTool,
  onAddHotspot, 
  onSelectHotspot 
}) {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => setImage(img);
      img.src = imageUrl;
    }
  }, [imageUrl]);

  useEffect(() => {
    if (image && canvasRef.current) {
      drawCanvas();
    }
  }, [image, hotspots, selectedHotspot, currentRect, zoom]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    const containerWidth = canvas.parentElement.clientWidth;
    const scale = (containerWidth / image.width) * (zoom / 100);
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, scaledWidth, scaledHeight);
    ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

    hotspots.forEach(hotspot => {
      const x = (hotspot.x / 100) * scaledWidth;
      const y = (hotspot.y / 100) * scaledHeight;
      const w = (hotspot.width / 100) * scaledWidth;
      const h = (hotspot.height / 100) * scaledHeight;

      const isSelected = selectedHotspot?.id === hotspot.id;

      ctx.strokeStyle = isSelected ? '#22d3ee' : '#a855f7';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.shadowColor = isSelected ? '#22d3ee' : '#a855f7';
      ctx.shadowBlur = isSelected ? 15 : 10;
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0;

      ctx.fillStyle = isSelected ? 'rgba(34, 211, 238, 0.15)' : 'rgba(168, 85, 247, 0.1)';
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(hotspot.label, x + 8, y + 22);
      ctx.shadowBlur = 0;
    });

    if (currentRect) {
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 10;
      ctx.strokeRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    }
  };

  const handleMouseDown = (e) => {
    if (activeTool !== "hotspot" && activeTool !== "select") return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "select") {
      const clickedHotspot = hotspots.find(h => {
        const hx = (h.x / 100) * canvas.width;
        const hy = (h.y / 100) * canvas.height;
        const hw = (h.width / 100) * canvas.width;
        const hh = (h.height / 100) * canvas.height;
        return x >= hx && x <= hx + hw && y >= hy && y <= hy + hh;
      });

      if (clickedHotspot) {
        onSelectHotspot(clickedHotspot);
      } else {
        onSelectHotspot(null);
      }
    } else if (activeTool === "hotspot") {
      setIsDrawing(true);
      setStartPos({ x, y });
      onSelectHotspot(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || activeTool !== "hotspot") return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = x - startPos.x;
    const height = y - startPos.y;

    setCurrentRect({
      x: width > 0 ? startPos.x : x,
      y: height > 0 ? startPos.y : y,
      width: Math.abs(width),
      height: Math.abs(height)
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentRect && currentRect.width > 20 && currentRect.height > 20) {
      const canvas = canvasRef.current;
      const xPercent = (currentRect.x / canvas.width) * 100;
      const yPercent = (currentRect.y / canvas.height) * 100;
      const wPercent = (currentRect.width / canvas.width) * 100;
      const hPercent = (currentRect.height / canvas.height) * 100;

      onAddHotspot({
        x: xPercent,
        y: yPercent,
        width: wPercent,
        height: hPercent
      });
    }

    setIsDrawing(false);
    setStartPos(null);
    setCurrentRect(null);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 50));
  };

  return (
    <Card className="glass-royal border-cyan-500/30 overflow-hidden" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
      <CardHeader className="border-b border-purple-500/30" style={{background: 'transparent'}}>
        <CardTitle className="text-white flex items-center justify-between">
          <span>{imageName}</span>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              size="icon"
              variant="ghost"
              className="text-cyan-400 hover:bg-cyan-500/20"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-white/70 min-w-[60px] text-center">{zoom}%</span>
            <Button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              size="icon"
              variant="ghost"
              className="text-cyan-400 hover:bg-cyan-500/20"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4" style={{background: '#000000'}}>
        <div className="relative overflow-auto max-h-[600px] border-2 border-dashed border-purple-500/30 rounded-lg">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`w-full ${activeTool === 'hotspot' ? 'cursor-crosshair' : 'cursor-pointer'}`}
          />
        </div>
        <p className="text-xs text-white/40 mt-3 text-center">
          {activeTool === 'hotspot' ? 'Click and drag to create a hotspot' : 'Click hotspots to select them'}
        </p>
      </CardContent>
    </Card>
  );
}