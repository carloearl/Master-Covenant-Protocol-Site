import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { BookOpen, Plus, Trash2, Link2, ExternalLink } from "lucide-react";

export default function KnowledgeBaseConnector({ onKnowledgeUpdate }) {
  const [sources, setSources] = useState(() => {
    const saved = localStorage.getItem("glyphbot_knowledge_sources");
    return saved ? JSON.parse(saved) : [];
  });
  const [newSource, setNewSource] = useState({ type: "url", value: "" });
  const [adding, setAdding] = useState(false);

  const addSource = async () => {
    if (!newSource.value.trim()) return;

    setAdding(true);
    
    try {
      const source = {
        id: crypto.randomUUID(),
        ...newSource,
        addedAt: new Date().toISOString()
      };

      const updated = [...sources, source];
      setSources(updated);
      localStorage.setItem("glyphbot_knowledge_sources", JSON.stringify(updated));
      
      setNewSource({ type: "url", value: "" });
      
      if (onKnowledgeUpdate) {
        onKnowledgeUpdate(updated);
      }

      // Log addition
      const user = await base44.auth.me().catch(() => ({ email: "unknown" }));
      await base44.entities.SystemAuditLog.create({
        event_type: "GLYPHBOT_KB_SOURCE_ADDED",
        description: `Knowledge source added: ${source.type}`,
        actor_email: user.email,
        resource_id: "glyphbot",
        metadata: { sourceType: source.type, sourceId: source.id },
        status: "success"
      }).catch(console.error);

    } catch (error) {
      console.error("Error adding knowledge source:", error);
    } finally {
      setAdding(false);
    }
  };

  const removeSource = async (id) => {
    const updated = sources.filter(s => s.id !== id);
    setSources(updated);
    localStorage.setItem("glyphbot_knowledge_sources", JSON.stringify(updated));
    
    if (onKnowledgeUpdate) {
      onKnowledgeUpdate(updated);
    }

    // Log removal
    const user = await base44.auth.me().catch(() => ({ email: "unknown" }));
    await base44.entities.SystemAuditLog.create({
      event_type: "GLYPHBOT_KB_SOURCE_REMOVED",
      description: "Knowledge source removed",
      actor_email: user.email,
      resource_id: "glyphbot",
      metadata: { sourceId: id },
      status: "success"
    }).catch(console.error);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Knowledge Base</h3>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex gap-2">
          <select
            value={newSource.type}
            onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
          >
            <option value="url">URL</option>
            <option value="doc">Document</option>
            <option value="api">API</option>
            <option value="db">Database</option>
          </select>

          <input
            type="text"
            value={newSource.value}
            onChange={(e) => setNewSource({ ...newSource, value: e.target.value })}
            placeholder={`Enter ${newSource.type}...`}
            onKeyDown={(e) => e.key === "Enter" && addSource()}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
          />

          <button
            onClick={addSource}
            disabled={adding || !newSource.value.trim()}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {sources.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <Link2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No knowledge sources connected</p>
          </div>
        ) : (
          sources.map(source => (
            <div
              key={source.id}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded uppercase font-semibold">
                      {source.type}
                    </span>
                    {source.autoScanResult?.includes("WARNING") && (
                      <span className="text-xs px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded">
                        ⚠️ Warning
                      </span>
                    )}
                    {source.autoScanResult?.includes("ALERT") && (
                      <span className="text-xs px-2 py-1 bg-red-600/20 text-red-400 rounded">
                        🚨 Alert
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white truncate">{source.value}</p>
                  {source.lastAutoScan && (
                    <p className="text-xs text-gray-500">
                      Auto-scanned: {new Date(source.lastAutoScan).toLocaleString()}
                    </p>
                  )}
                </div>
                {source.type === "url" && (
                  <a
                    href={source.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-cyan-400"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              
              <button
                onClick={() => removeSource(source.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-500/20 rounded transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {sources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            {sources.length} knowledge source{sources.length !== 1 ? "s" : ""} connected
          </p>
        </div>
      )}
    </div>
  );
}