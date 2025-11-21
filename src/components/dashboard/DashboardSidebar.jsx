import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { navItems } from "./DashboardData";

export default function DashboardSidebar({ selectedModel, setSelectedModel }) {
  const [openCategory, setOpenCategory] = useState("General");

  return (
    <div className="w-64 glass-royal border-r border-blue-500/30 h-screen overflow-y-auto sticky top-0" style={{ backgroundColor: 'rgba(10, 10, 20, 0.85)' }}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4 text-white">
          Data Models
        </h2>
        <div className="space-y-2">
          {navItems.map((category) => (
            <div key={category.category}>
              <button
                onClick={() => setOpenCategory(openCategory === category.category ? null : category.category)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                style={{ backgroundColor: 'transparent' }}
              >
                <span className="font-semibold text-sm text-gray-300">
                  {category.category}
                </span>
                {openCategory === category.category ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {openCategory === category.category && (
                <div className="ml-2 mt-1 space-y-1">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedModel(item)}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                          selectedModel?.entity === item.entity
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:bg-blue-500/20'
                        }`}
                        style={{ backgroundColor: selectedModel?.entity === item.entity ? 'rgb(37 99 235)' : 'transparent' }}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}