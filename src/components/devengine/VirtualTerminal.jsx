import React, { useState } from 'react';

export default function VirtualTerminal(props) {
  const { onCommand } = props;
  const [lines, setLines] = useState([
    '=== Glyph Engine Terminal ===',
    'Type "help" for available commands',
    ''
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const promptLine = '> ' + trimmed;
    let response = '';

    // Built-in commands
    if (trimmed === 'help') {
      response = `Available commands:
  help       - Show this help
  clear      - Clear terminal
  status     - Show system status
  tree       - Show file tree
  files      - List recent files
  log        - Show recent actions
  version    - Show engine version`;
    } else if (trimmed === 'clear') {
      setLines(['Terminal cleared.', '']);
      setInput('');
      setHistory(prev => [...prev, trimmed]);
      return;
    } else if (trimmed === 'version') {
      response = 'GlyphLock Dev Engine v1.0.0';
    } else {
      // External command handler
      try {
        if (onCommand) {
          const result = await onCommand(trimmed);
          response = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
        } else {
          response = 'Command not recognized. Type "help" for available commands.';
        }
      } catch (err) {
        response = 'Error: ' + err.message;
      }
    }

    setLines(function update(prev) {
      const next = prev.concat(promptLine, response, '');
      return next.slice(-200);
    });
    setHistory(prev => [...prev, trimmed].slice(-50));
    setHistoryIndex(-1);
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  }

  return (
    <div className="h-full bg-black text-[#00ff41] font-mono text-[11px] flex flex-col">
      <div className="px-3 py-1 border-b border-emerald-500/40 text-xs uppercase tracking-wide">
        Terminal
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-1">
        {lines.map(function renderLine(line, idx) {
          return (
            <div key={idx} className="whitespace-pre-wrap break-words">
              {line}
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-emerald-500/40 flex">
        <span className="px-2 py-1 text-xs select-none">{'>'}</span>
        <input
          className="flex-1 bg-transparent outline-none text-[#00ff41] text-[11px] py-1 pr-2"
          value={input}
          onChange={function onChange(e) {
            setInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          placeholder="Type 'help' for commands..."
        />
      </form>
    </div>
  );
}