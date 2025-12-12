import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import FileTree from './FileTree';
import AIConsole from './AIConsole';
import MonacoViewer from './MonacoViewer';
import VirtualTerminal from './VirtualTerminal';
import DiffViewer from './DiffViewer';
import ApprovalPanel from './ApprovalPanel';
import { ValidationErrorAlert } from './utils/validationErrors';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Dev Mode Layout - Main container for Dev Engine
 * Admin-only development studio
 */
export default function DevModeLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [showDiff, setShowDiff] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Check authorization
  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          setLoading(false);
          return;
        }

        const userData = await base44.auth.me();
        setUser(userData);

        // Check admin role
        const allowedUsers = ['carloearl@glyphlock.com', 'carloearl@gmail.com'];
        const isAuthorized = userData.role === 'admin' || allowedUsers.includes(userData.email);
        
        setAuthorized(isAuthorized);
        
        if (!isAuthorized) {
          toast.error('Dev Mode requires admin access');
        }
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Authentication failed');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Handle file selection from tree
  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setAnalysis(null);
    setProposal(null);
    setShowDiff(false);
    setValidationErrors([]);

    try {
      const response = await base44.functions.invoke('devGetFileContent', {
        filePath: file.path
      });

      if (response.data.success) {
        setFileContent(response.data.content);
        toast.success(`Loaded ${file.name}`);
      } else {
        // Check if it's a schema validation error
        if (response.data.error && response.data.error.includes('SCHEMA VIOLATION')) {
          setValidationErrors([response.data.error]);
          toast.error('Schema validation failed');
        } else {
          throw new Error(response.data.error || 'Failed to load file');
        }
      }
    } catch (error) {
      console.error('File load error:', error);
      toast.error('Failed to load file: ' + error.message);
    }
  };

  // Handle analysis request
  const handleAnalyze = async () => {
    if (!selectedFile || !fileContent) {
      toast.error('No file selected');
      return;
    }

    try {
      const response = await base44.functions.invoke('devAnalyzeFile', {
        filePath: selectedFile.path,
        fileContent: fileContent
      });

      if (response.data.success) {
        setAnalysis(response.data.analysis);
        toast.success('Analysis complete');
      } else {
        throw new Error(response.data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed: ' + error.message);
    }
  };

  // Handle change proposal
  const handlePropose = async (changeDescription) => {
    if (!selectedFile || !fileContent) {
      toast.error('No file selected');
      return;
    }

    try {
      const response = await base44.functions.invoke('devProposeChange', {
        filePath: selectedFile.path,
        fileContent: fileContent,
        changeDescription: changeDescription
      });

      if (response.data.success) {
        setProposal(response.data.proposal);
        setShowDiff(true);
        toast.success('Proposal generated');
      } else {
        throw new Error(response.data.error || 'Proposal failed');
      }
    } catch (error) {
      console.error('Proposal error:', error);
      toast.error('Proposal failed: ' + error.message);
    }
  };

  // Handle approval
  const handleApprove = async (proposalId) => {
    if (!proposal) {
      toast.error('No proposal to approve');
      return;
    }

    setValidationErrors([]);

    try {
      const response = await base44.functions.invoke('devApplyDiff', {
        proposalId: proposalId,
        filePath: selectedFile.path,
        modifiedCode: proposal.modifiedCode,
        approved: true
      });

      if (response.data.success) {
        toast.success('Change applied successfully');
        setFileContent(proposal.modifiedCode);
        setProposal(null);
        setShowDiff(false);
      } else {
        // Check for schema validation errors
        if (response.data.error && response.data.error.includes('SCHEMA VIOLATION')) {
          const errors = response.data.error.split('\n').filter(e => e.trim());
          setValidationErrors(errors);
          toast.error('Schema validation failed');
        } else {
          throw new Error(response.data.error || 'Apply failed');
        }
      }
    } catch (error) {
      console.error('Apply error:', error);
      toast.error('Failed to apply: ' + error.message);
    }
  };

  // Handle rejection
  const handleReject = () => {
    setProposal(null);
    setShowDiff(false);
    toast.info('Proposal rejected');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-indigo-950/20 to-black">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white">Loading Dev Engine...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-indigo-950/20 to-black">
        <div className="text-center max-w-md">
          <Lock className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            Dev Mode is restricted to administrators only.
          </p>
          <p className="text-sm text-gray-500">
            Contact admin@glyphlock.com for access.
          </p>
        </div>
      </div>
    );
  }

  // Main layout
  return (
    <div className="h-screen bg-gradient-to-br from-black via-indigo-950/20 to-black flex flex-col">
      {/* Header */}
      <div className="border-b border-blue-500/20 bg-white/5 backdrop-blur-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Dev Engine</h1>
            <p className="text-sm text-blue-300">Secure Development Studio</p>
          </div>
          <div className="text-sm text-gray-400">
            {user?.email}
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mx-4 mt-4">
          <ValidationErrorAlert errors={validationErrors} />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - File Tree */}
        <div className="w-64 border-r border-blue-500/20 bg-white/5 backdrop-blur-xl overflow-y-auto">
          <FileTree onFileSelect={handleFileSelect} selectedFile={selectedFile} />
        </div>

        {/* Center panel - AI Console + Monaco */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* AI Console */}
          <div className="h-1/3 border-b border-blue-500/20 bg-white/5 backdrop-blur-xl overflow-y-auto">
            <AIConsole
              selectedFile={selectedFile}
              analysis={analysis}
              onAnalyze={handleAnalyze}
              onPropose={handlePropose}
            />
          </div>

          {/* Monaco Viewer or Diff Viewer */}
          <div className="flex-1 overflow-hidden">
            {showDiff && proposal ? (
              <DiffViewer
                original={fileContent}
                modified={proposal.modifiedCode}
                filePath={selectedFile?.path}
              />
            ) : (
              <MonacoViewer
                content={fileContent}
                filePath={selectedFile?.path}
                language={selectedFile?.name.endsWith('.json') ? 'json' : 
                         selectedFile?.name.endsWith('.css') ? 'css' : 'javascript'}
              />
            )}
          </div>
        </div>

        {/* Right panel - Terminal */}
        <div className="w-96 border-l border-blue-500/20 bg-white/5 backdrop-blur-xl overflow-y-auto">
          <VirtualTerminal />
        </div>
      </div>

      {/* Bottom panel - Approval Panel */}
      {proposal && (
        <div className="border-t border-blue-500/20 bg-white/5 backdrop-blur-xl">
          <ApprovalPanel
            proposal={proposal}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      )}
    </div>
  );
}