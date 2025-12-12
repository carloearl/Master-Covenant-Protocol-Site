import React from 'react';

export default function MonacoViewer(props) {
  const { path, code } = props;
  const displayCode = typeof code === 'string' ? code : '';

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="px-3 py-2 text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800 flex justify-between">
        <span>Code Viewer</span>
        <span className="text-[10px] text-slate-500">
          {path || 'No file selected'}
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        <pre className="h-full p-3 text-xs bg-slate-950 text-slate-100 font-mono whitespace-pre">
          {displayCode || '// No content'}
        </pre>
      </div>
    </div>
  );
}