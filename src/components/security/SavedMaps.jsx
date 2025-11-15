import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";
import SeverityBadge from "@/components/shared/SeverityBadge";

export default function SavedMaps() {
  const { data: maps = [], isLoading } = useQuery({
    queryKey: ['maps'],
    queryFn: () => base44.entities.HotzoneMap.list('-created_date', 20)
  });

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-400" />
            Saved Security Maps
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading maps...</div>
          ) : maps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No saved maps yet</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {maps.map((map) => (
                <Card key={map.id} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src={map.image_url} 
                      alt={map.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <SeverityBadge severity={map.threat_level} />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-2">{map.name}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {map.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{map.hotspots?.length || 0} hotspots</span>
                      <span>{new Date(map.created_date).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}