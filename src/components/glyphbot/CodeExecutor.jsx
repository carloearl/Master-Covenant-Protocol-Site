import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { promptLLM } from "@/components/utils/llmClient";
import { Play, Loader2, AlertTriangle, Terminal } from "lucide-react";

export default function CodeExecutor() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(null);
  const [executing, setExecuting] = useState(false);

  const executeCode = async () => {
    if (!code.trim()) return;

    setExecuting(true);
    setOutput(null);

    try {
      const prompt = `Execute this ${language} code in a secure sandbox and provide the output:

\`\`\`${language}
${code}
\`\`\`

Requirements:
1. Simulate execution safely (don't actually execute harmful code)
2. Provide expected output or error messages
3. Flag any security concerns
4. Suggest improvements if applicable

Format response as:
OUTPUT:
[execution output]

SECURITY NOTES:
[any security concerns]

SUGGESTIONS:
[code improvements]`;

      const response = await promptLLM(prompt);

      setOutput({
        result: response,
        timestamp: new Date().toISOString(),
        language
      });

      // Log execution
      await base44.entities.SystemAuditLog.create({
        event_type: "GLYPHBOT_CODE_EXEC",
        description: `Code execution simulated (${language})`,
        actor_email: (await base44.auth.me().catch(() => ({})))?.email || "unknown",
        resource_id: "glyphbot",
        metadata: { language, codeLength: code.length },
        status: "success"
      }).catch(console.error);

    } catch (error) {
      console.error("Code execution error:", error);
      setOutput({
        error: "Failed to execute code. Please try again.",
        timestamp: new Date().toISOString()
      });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Secure Code Executor</h2>
        <p className="text-gray-400">Test code in a simulated secure sandbox</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-500">
            <p className="font-semibold mb-1">Security Notice</p>
            <p>Code is simulated by AI, not actually executed. This ensures no harmful code can run on the system.</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Write your ${language} code here...`}
            rows={12}
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm resize-none focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button
          onClick={executeCode}
          disabled={executing || !code.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold disabled:opacity-50 hover:from-green-500 hover:to-emerald-500 transition-all"
        >
          {executing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Execute Code
            </>
          )}
        </button>

        {output && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Execution Result</h3>
            </div>

            {output.error ? (
              <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-500">{output.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-black/50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">
                    {output.language} • {new Date(output.timestamp).toLocaleString()}
                  </p>
                  <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                    {output.result}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}