import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";

export default function ColorPaletteSelector({ 
  selectedPalette, 
  setSelectedPalette, 
  customColors, 
  setCustomColors 
}) {
  const colorPalettes = [
    { id: "classic", name: "Classic", fg: "#000000", bg: "#FFFFFF" },
    { id: "royal", name: "Royal", fg: "#1E40AF", bg: "#FFFFFF" },
    { id: "cyber", name: "Cyber", fg: "#0EA5E9", bg: "#0F172A" },
    { id: "emerald", name: "Emerald", fg: "#059669", bg: "#FFFFFF" },
    { id: "sunset", name: "Sunset", fg: "#DC2626", bg: "#FEF2F2" },
    { id: "grape", name: "Grape", fg: "#7C3AED", bg: "#FFFFFF" }
  ];

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <Palette className="w-4 h-4" />
          Color Palette
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {colorPalettes.map(palette => (
            <button
              key={palette.id}
              onClick={() => setSelectedPalette(palette.id)}
              className={`p-2 rounded-lg border transition-all ${
                selectedPalette === palette.id ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded border border-gray-600" style={{ backgroundColor: palette.fg }} />
                <div className="w-4 h-4 rounded border border-gray-600" style={{ backgroundColor: palette.bg }} />
              </div>
              <div className="text-xs font-semibold text-white">{palette.name}</div>
            </button>
          ))}
        </div>
        <div className="mt-3 p-2 bg-gray-800 rounded-lg border border-gray-700">
          <Label className="text-white text-xs mb-2 block">Custom Colors</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="color"
              value={customColors.fg}
              onChange={(e) => {
                setCustomColors({...customColors, fg: e.target.value});
                setSelectedPalette("custom");
              }}
              className="h-8 bg-gray-700 border-gray-600"
            />
            <Input
              type="color"
              value={customColors.bg}
              onChange={(e) => {
                setCustomColors({...customColors, bg: e.target.value});
                setSelectedPalette("custom");
              }}
              className="h-8 bg-gray-700 border-gray-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}