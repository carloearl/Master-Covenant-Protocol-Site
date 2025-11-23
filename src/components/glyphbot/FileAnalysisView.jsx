import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { analyzeLLM } from "@/components/utils/llmClient";
import { Upload, File, X, Loader2, AlertCircle } from "lucide-react";

export default function FileAnalysisView() {
  const [files, setFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);
    setResults(null);
  };

  const analyzeFiles = async () => {
    if (files.length === 0) return;
    
    setAnalyzing(true);
    setResults(null);

    try {
      const uploadPromises = files.map(async (file) => {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        return { name: file.name, url: file_url, size: file.size, type: file.type };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      const analysisPrompt = `Analyze these files for security risks, vulnerabilities, and potential issues:
      
${uploadedFiles.map(f => `- ${f.name} (${f.type}, ${(f.size / 1024).toFixed(2)} KB)`).join('\n')}

Provide a comprehensive security analysis including:
1. File type verification
2. Potential security risks
3. Malware/suspicious content detection
4. Recommendations
5. Risk level (LOW/MEDIUM/HIGH/CRITICAL)`;

      const response = await analyzeLLM(analysisPrompt, uploadedFiles.map(f => f.url));

      setResults({
        files: uploadedFiles,
        analysis: response,
        timestamp: new Date().toISOString()
      });

      // Log the analysis
      await base44.entities.SystemAuditLog.create({
        event_type: "GLYPHBOT_FILE_ANALYSIS",
        description: "File security analysis completed",
        actor_email: (await base44.auth.me().catch(() => ({})))?.email || "unknown",
        resource_id: "glyphbot",
        metadata: { fileCount: files.length, fileNames: files.map(f => f.name) },
        status: "success"
      }).catch(console.error);

    } catch (error) {
      console.error("File analysis error:", error);
      setResults({
        error: "Failed to analyze files. Please try again."
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">File Security Analysis</h2>
        <p className="text-gray-400">Upload files for comprehensive security analysis</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".txt,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.php,.html,.css,.json,.xml,.md,.pdf,.doc,.docx"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium text-white mb-2">Upload Files</p>
            <p className="text-sm text-gray-500">Click to select files for analysis</p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="text-sm font-semibold text-white mb-3">Selected Files ({files.length})</h3>
            <div className="space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-white">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={analyzeFiles}
              disabled={analyzing}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold disabled:opacity-50 hover:from-cyan-500 hover:to-blue-500 transition-all"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Files"
              )}
            </button>
          </div>
        )}

        {results && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Analysis Results</h3>
            
            {results.error ? (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-500">{results.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Analyzed at</p>
                  <p className="text-white">{new Date(results.timestamp).toLocaleString()}</p>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                    {results.analysis}
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