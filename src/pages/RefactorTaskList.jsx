import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default function RefactorTaskList() {
  const [filter, setFilter] = useState("all");

  const tasks = {
    "Priority 1: Critical Bugs & Console Errors": [
      { task: "Audit entire codebase for console errors", status: "pending" },
      { task: "Fix any duplicate component registrations", status: "pending" },
      { task: "Resolve any broken imports or missing dependencies", status: "pending" },
      { task: "Fix any React key warnings", status: "pending" },
      { task: "Resolve any API/integration errors", status: "pending" },
      { task: "Fix any routing issues", status: "pending" }
    ],
    "Priority 2: Security Tools Merge (QR + Steganography)": [
      { task: "Create unified SecureDataTools page", status: "pending" },
      { task: "Merge QR Generator and Steganography into tabbed interface", status: "pending" },
      { task: "Consolidate shared file upload logic", status: "pending" },
      { task: "Unify security scanning features", status: "pending" },
      { task: "Share common UI components (file preview, download)", status: "pending" },
      { task: "Merge entities: QRGenHistory + SteganographyHistory", status: "pending" },
      { task: "Update navigation/routing", status: "pending" },
      { task: "Delete redundant pages after merge", status: "pending" },
      { task: "Update all internal links", status: "pending" }
    ],
    "Priority 3: Security Operations Center (Hotzone + HSSS)": [
      { task: "Create unified SecurityOperationsCenter page", status: "pending" },
      { task: "Merge HotzoneMapper and HSSS into single interface", status: "pending" },
      { task: "Combine map visualization with threat monitoring", status: "pending" },
      { task: "Consolidate HotzoneMap, HotzoneThreat entities", status: "pending" },
      { task: "Create unified threat dashboard", status: "pending" },
      { task: "Integrate real-time monitoring with map hotspots", status: "pending" },
      { task: "Add ability to create threats directly from map markers", status: "pending" },
      { task: "Update navigation/routing", status: "pending" },
      { task: "Delete redundant pages after merge", status: "pending" },
      { task: "Update all internal links", status: "pending" }
    ],
    "Priority 4: Governance Hub (Covenant + Team + Dashboard)": [
      { task: "Create unified GovernanceHub page", status: "pending" },
      { task: "Integrate Master Covenant content as main section", status: "pending" },
      { task: "Add Dream Team as 'Our Team' tab/section", status: "pending" },
      { task: "Incorporate Covenant Dashboard as 'AI Bindings' tab", status: "pending" },
      { task: "Create cohesive navigation between sections", status: "pending" },
      { task: "Update navigation/routing", status: "pending" },
      { task: "Delete redundant pages after merge", status: "pending" },
      { task: "Update all internal links", status: "pending" }
    ],
    "Priority 5: Code Quality & Performance": [
      { task: "Break down large components into smaller, focused ones", status: "pending" },
      { task: "Remove duplicate code across components", status: "pending" },
      { task: "Create shared utility functions", status: "pending" },
      { task: "Optimize re-renders with proper memoization", status: "pending" },
      { task: "Lazy load heavy components", status: "pending" },
      { task: "Review all entities for redundancy", status: "pending" },
      { task: "Consolidate similar entities", status: "pending" },
      { task: "Ensure proper indexing for performance", status: "pending" },
      { task: "Remove unused entities", status: "pending" }
    ],
    "Priority 6: UI/UX Consistency": [
      { task: "Standardize card designs across pages", status: "pending" },
      { task: "Unify button styles and interactions", status: "pending" },
      { task: "Consistent spacing and layouts", status: "pending" },
      { task: "Standardize error handling UI", status: "pending" },
      { task: "Consistent loading states", status: "pending" }
    ],
    "Priority 7: Navigation & Structure": [
      { task: "Update Layout with new consolidated pages", status: "pending" },
      { task: "Remove links to deprecated pages", status: "pending" },
      { task: "Create logical grouping in navigation", status: "pending" },
      { task: "Update footer links", status: "pending" },
      { task: "Update mobile menu", status: "pending" },
      { task: "Clean up unused routes", status: "pending" },
      { task: "Implement proper 404 handling", status: "pending" },
      { task: "Add breadcrumbs for complex sections", status: "pending" }
    ],
    "Completed Tasks": [
      { task: "Video hero section optimization", status: "completed" },
      { task: "Logo positioning on hero video", status: "completed" },
      { task: "TechStackCarousel improvements - more icons & smoother animation", status: "completed" }
    ]
  };

  const getTotalTasks = () => {
    return Object.values(tasks).flat().length;
  };

  const getCompletedTasks = () => {
    return Object.values(tasks).flat().filter(t => t.status === "completed").length;
  };

  const getProgress = () => {
    return Math.round((getCompletedTasks() / getTotalTasks()) * 100);
  };

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
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400">{getTotalTasks()}</div>
                  <div className="text-sm text-gray-400">Total Tasks</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">{getCompletedTasks()}</div>
                  <div className="text-sm text-gray-400">Completed</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
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
              <Card key={category} className="bg-gray-900 border-gray-800">
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
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
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

          <Card className="mt-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2 text-white">Important Notes</h3>
              <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                <li>Backup current codebase before major refactors</li>
                <li>Test each consolidation in isolation before moving to next</li>
                <li>Keep user experience consistent during transitions</li>
                <li>Monitor console for new errors after each change</li>
                <li>Update documentation as features are consolidated</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}