import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { navItems } from "./DashboardData";

export default function DashboardSidebar({ selectedModel, setSelectedModel, darkMode }) {
  const [openCategory, setOpenCategory] = useState("General");

  return (
    <div className={`w-64 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-r ${darkMode ? 'border-gray-800' : 'border-gray-200'} h-screen overflow-y-auto sticky top-0`}>
      <div className="p-4">
        <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Data Models
        </h2>
        <div className="space-y-2">
          {navItems.map((category) => (
            <div key={category.category}>
              <button
                onClick={() => setOpenCategory(openCategory === category.category ? null : category.category)}
                className={`w-full flex items-center justify-between p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <span className={`font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {category.category}
                </span>
                {openCategory === category.category ? (
                  <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                )}
              </button>
              
              {openCategory === category.category && (
                <div className="ml-2 mt-1 space-y-1">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedModel({ entity: item.entity, label: item.label })}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                          selectedModel?.entity === item.entity
                            ? darkMode 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-500 text-white'
                            : darkMode
                              ? 'text-gray-400 hover:bg-gray-800'
                              : 'text-gray-600 hover:bg-gray-100'
                        }`}
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