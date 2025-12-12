import React, { useState, useEffect } from 'react';

export default function MonacoViewer(props) {
  const { path, code } = props;
  const [MonacoEditor, setMonacoEditor] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(function loadMonaco() {
    let cancelled = false;

    async function load() {
      try {
        const mod = await import('@monaco-editor/react');
        if (!cancelled) {
          setMonacoEditor(function getEditor() {
            return mod.default;
          });
        }
      } catch (err) {
        console.error('Monaco editor not available, using fallback viewer:', err);
        if (!cancelled) {
          setLoadFailed(true);
        }
      }
    }

    load();

    return function cleanup() {
      cancelled = true;
    };
  }, []);

  const displayCode = typeof code === 'string' ? code : '';

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="px-3 py-2 text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800 flex justify-between">
        <span>Code Viewer</span>
        <span className="text-[10px] text-slate-500">
          {path || 'No file selected'}
        </span>
      </div>

      <div className="flex-1">
        {MonacoEditor ? (
          <MonacoEditor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={displayCode}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false
            }}
          />
        ) : (
          <div className="h-full overflow-auto p-3 bg-slate-900">
            <pre className="text-xs text-slate-100 font-mono whitespace-pre">
              {displayCode || '// No content'}
            </pre>
            {loadFailed && (
              <div className="mt-2 text-[10px] text-yellow-400">
                Monaco editor unavailable - using basic viewer
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}