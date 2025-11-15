import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";

export default function DataTable({ selectedModel, darkMode }) {
  const { data: records = [], isLoading, refetch } = useQuery({
    queryKey: ['entity-data', selectedModel?.entity],
    queryFn: () => selectedModel ? base44.entities[selectedModel.entity].list() : [],
    enabled: !!selectedModel
  });

  if (!selectedModel) {
    return (
      <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <Database className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Select a Data Model
          </h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Choose a model from the sidebar to view and manage data
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <LoadingSpinner message={`Loading ${selectedModel.label}...`} />
      </div>
    );
  }

  const columns = records.length > 0 ? Object.keys(records[0]) : [];

  return (
    <div className={`flex-1 p-8 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} overflow-auto`}>
      <Card className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={darkMode ? 'text-white' : 'text-gray-900'}>
              {selectedModel.label} ({records.length})
            </CardTitle>
            <Button
              onClick={() => refetch()}
              size="sm"
              variant="outline"
              className={darkMode ? 'border-gray-700 text-white' : 'border-gray-300'}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <EmptyState 
              icon={Database}
              title="No records found"
              description={`No ${selectedModel.label} records exist yet`}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                    {columns.map((col) => (
                      <th key={col} className={`text-left p-3 font-semibold text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, idx) => (
                    <tr 
                      key={idx} 
                      className={`border-b ${darkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-100 hover:bg-gray-50'}`}
                    >
                      {columns.map((col) => (
                        <td key={col} className={`p-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {typeof record[col] === 'object' 
                            ? JSON.stringify(record[col]) 
                            : String(record[col] || '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}