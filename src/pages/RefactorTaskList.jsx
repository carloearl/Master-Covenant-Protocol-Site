import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default function RefactorTaskList() {
  const tasks = {
    "Priority 1: Critical Bugs & Console Errors": [
      { task: "Fix any duplicate component registrations", status: "pending" },
      { task: "Resolve any broken imports or missing dependencies", status: "completed" },
      { task: "Fix any React key warnings", status: "pending" },
      { task: "Resolve any API/integration errors", status: "pending" },
      { task: "Fix any routing issues", status: "completed" },
      { task: "Fix white-on-white text contrast issues", status: "completed" },
      { task: "Nuclear CSS override for all white backgrounds", status: "completed" }
    ],
    "Priority 2: Security Tools Merge": [
      { task: "Create unified VisualCryptography page", status: "completed" },
      { task: "Merge QR Generator and Steganography", status: "completed" },
      { task: "Consolidate shared file upload logic", status: "completed" },
      { task: "Update navigation/routing", status: "completed" },
      { task: "Create redirect pages", status: "completed" }
    ],
    "Priority 3: Security Operations Center": [
      { task: "Create unified SecurityOperationsCenter page", status: "completed" },
      { task: "Merge HotzoneMapper and HSSS", status: "completed" },
      { task: "Combine map visualization with threat monitoring", status: "completed" },
      { task: "Update navigation/routing", status: "completed" },
      { task: "Create redirect pages", status: "completed" }
    ],
    "Priority 4: Governance Hub": [
      { task: "Create unified GovernanceHub page", status: "completed" },
      { task: "Integrate Master Covenant content", status: "completed" },
      { task: "Add Dream Team as 'Our Team' tab", status: "completed" },
      { task: "Update navigation/routing", status: "completed" },
      { task: "Create redirect pages", status: "completed" }
    ],
    "Priority 5: Code Quality & Performance": [
      { task: "Break down Home page into components", status: "completed" },
      { task: "Create shared error handling components", status: "completed" },
      { task: "Create shared loading components", status: "completed" },
      { task: "Remove duplicate code across components", status: "in-progress" },
      { task: "Optimize re-renders with memoization", status: "pending" },
      { task: "Lazy load heavy components", status: "pending" },
      { task: "Remove unused entities", status: "completed" }
    ],
    "Priority 6: UI/UX Consistency": [
      { task: "Standardize card designs", status: "completed" },
      { task: "Unify button styles", status: "completed" },
      { task: "Fix dropdown/menu contrast", status: "completed" },
      { task: "Consistent spacing and layouts", status: "completed" },
      { task: "Standardize error handling UI", status: "completed" },
      { task: "Consistent loading states", status: "completed" }
    ],
    "Priority 7: Navigation & Structure": [
      { task: "Update Layout with consolidated pages", status: "completed" },
      { task: "Remove links to deprecated pages", status: "completed" },
      { task: "Create logical grouping in navigation", status: "completed" },
      { task: "Update footer links", status: "completed" },
      { task: "Update mobile menu", status: "completed" },
      { task: "Implement proper 404 handling", status: "completed" },
      { task: "Add breadcrumbs for complex sections", status: "pending" }
    ],
    "Completed Major Tasks": [
      { task: "Video hero optimization", status: "completed" },
      { task: "Logo positioning on hero", status: "completed" },
      { task: "TechStackCarousel improvements", status: "completed" },
      { task: "NavigationConfig centralization", status: "completed" },
      { task: "3 major page consolidations", status: "completed" },
      { task: "Glassmorphism theme fixes", status: "completed" },
      { task: "Nuclear CSS dark mode enforcement", status: "completed" },
      { task: "Removed unused entities", status: "completed" },
      { task: "Split Home into 4 components", status: "completed" },
      { task: "Created ErrorBoundary component", status: "completed" },
      { task: "Created PageLoader component", status: "completed" },
      { task: "Created DataLoadError component", status: "completed" },
      { task: "Fixed GlyphBotJr dark mode", status: "completed" }
    ]
  };

  const getTotalTasks = () => Object.values(tasks).flat().length;
  const getCompletedTasks = () => Object.values(tasks).flat().filter(t => t.status === "completed").length;
  const getProgress = () => Math.round((getCompletedTasks() / getTotalTasks()) * 100);

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Refactoring <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Task List</span>
            </h1>
            <p className="text-gray-400 mb-6">
              Comprehensive consolidation, bug fixes, and optimization roadmap
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="glass-card-dark">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400">{getTotalTasks()}</div>
                  <div className="text-sm text-gray-400">Total Tasks</div>
                </CardContent>
              </Card>
              <Card className="glass-card-dark">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">{getCompletedTasks()}</div>
                  <div className="text-sm text-gray-400">Completed</div>
                </CardContent>
              </Card>
              <Card className="glass-card-dark">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">{getProgress()}%</div>
                  <div className="text-sm text-gray-400">Progress</div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-3 mb-6">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(tasks).map(([category, taskList]) => (
              <Card key={category} className="glass-card-dark">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    {category}
                    <Badge variant="outline" className="text-gray-400">
                      {taskList.filter(t => t.status === "completed").length}/{taskList.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {taskList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg glass-card hover:border-blue-500/50 transition-colors"
                      >
                        {item.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        ) : item.status === "in-progress" ? (
                          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={item.status === "completed" ? "line-through text-gray-500" : "text-gray-300"}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 glass-card-dark border-green-500/30">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2 text-white">Latest Improvements</h3>
              <ul className="text-sm text-green-300 space-y-2 list-disc list-inside">
                <li>✅ Created reusable error handling components (ErrorBoundary, DataLoadError)</li>
                <li>✅ Standardized loading states with PageLoader component</li>
                <li>✅ Fixed GlyphBotJr dark mode consistency</li>
                <li>✅ Enhanced global CSS with stronger dark mode enforcement</li>
                <li>✅ Improved dropdown/menu contrast and visibility</li>
                <li>✅ Removed darkMode prop dependency - global dark theme</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}