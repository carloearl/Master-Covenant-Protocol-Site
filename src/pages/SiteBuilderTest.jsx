import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function SiteBuilderTest() {
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setLoading(true);
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      const response = await base44.functions.invoke('testSiteBuilder', {});
      setTestResults(response.data);
      toast.success('Tests complete');
    } catch (error) {
      console.error('Test failed:', error);
      toast.error('Test failed: ' + error.message);
      setTestResults({
        error: error.message,
        status: 'Failed'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-950/20 to-black">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white">Running Site Builder Tests...</p>
        </div>
      </div>
    );
  }

  const StatusIcon = ({ passed }) => {
    if (passed === true) return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    if (passed === false) return <XCircle className="w-5 h-5 text-red-400" />;
    return <AlertCircle className="w-5 h-5 text-yellow-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950/20 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Site Builder Test Suite</h1>
          <p className="text-blue-300">Verify auth, models, and functionality</p>
          <Button onClick={runTests} className="mt-4 bg-blue-600 hover:bg-blue-700">
            <Play className="w-4 h-4 mr-2" />
            Run Tests Again
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <Card className="mb-6 bg-white/5 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">Current User</CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <Badge className={user.role === 'admin' ? 'bg-green-500' : 'bg-yellow-500'}>
                {user.role === 'admin' ? 'Admin Access' : 'Standard User'}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResults && (
          <>
            {/* Status Banner */}
            <div className="mb-6 p-6 rounded-xl border-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30">
              <h2 className="text-2xl font-bold text-white mb-2">
                {testResults.status}
              </h2>
              <p className="text-sm text-blue-300">{testResults.timestamp}</p>
            </div>

            {/* Auth Tests */}
            {testResults.tests?.auth && (
              <Card className="mb-6 bg-white/5 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <StatusIcon passed={testResults.tests.auth.passed} />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-300">Email</p>
                      <p className="font-mono">{testResults.tests.auth.user_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-300">Role</p>
                      <p className="font-mono">{testResults.tests.auth.user_role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-300">Authorized</p>
                      <Badge className={testResults.tests.auth.is_authorized ? 'bg-green-500' : 'bg-red-500'}>
                        {testResults.tests.auth.is_authorized ? '✅ Yes' : '❌ No'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Keys */}
            {testResults.tests?.api_keys && (
              <Card className="mb-6 bg-white/5 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white">API Keys Status</CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(testResults.tests.api_keys).map(([key, value]) => (
                      <div key={key} className="p-3 rounded-lg bg-white/5">
                        <p className="text-sm text-blue-300 capitalize">{key}</p>
                        <p className="font-mono text-lg">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Models */}
            {testResults.tests?.models && (
              <Card className="mb-6 bg-white/5 border-violet-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Available Models</CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(testResults.tests.models).map(([key, value]) => (
                      <div key={key} className="p-3 rounded-lg bg-white/5 border border-violet-500/20">
                        <p className="text-xs text-violet-300 mb-1">{key.replace(/_/g, ' ').toUpperCase()}</p>
                        <p className="text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Agent System */}
            {testResults.tests?.agent_system && (
              <Card className="mb-6 bg-white/5 border-fuchsia-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <StatusIcon passed={testResults.tests.agent_system.passed} />
                    Agent System
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  {testResults.tests.agent_system.passed ? (
                    <div>
                      <p className="text-green-400">✅ Agent connection successful</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Conversation ID: {testResults.tests.agent_system.conversation_id}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-400">❌ Agent connection failed</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Error: {testResults.tests.agent_system.error}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Gemini Test */}
            {testResults.tests?.gemini_test && (
              <Card className="mb-6 bg-white/5 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <StatusIcon passed={testResults.tests.gemini_test.passed} />
                    Gemini API Test
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  {testResults.tests.gemini_test.passed ? (
                    <div>
                      <p className="text-green-400 mb-2">✅ {testResults.tests.gemini_test.model}</p>
                      <div className="bg-black/50 rounded-lg p-4">
                        <p className="font-mono text-sm">{testResults.tests.gemini_test.response}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-400">❌ {testResults.tests.gemini_test.error}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions Available */}
            {testResults.actions_available && (
              <Card className="mb-6 bg-white/5 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Available Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {testResults.actions_available.map(action => (
                      <Badge key={action} className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fallback Chain */}
            {testResults.fallback_chain && (
              <Card className="bg-white/5 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Fallback Chain</CardTitle>
                </CardHeader>
                <CardContent className="text-white space-y-2">
                  {testResults.fallback_chain.map((step, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white/5 border border-amber-500/20">
                      {step}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}