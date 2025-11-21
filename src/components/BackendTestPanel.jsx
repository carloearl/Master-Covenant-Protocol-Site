import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { glyphLockAPI } from './api/glyphLockAPI';
import { CheckCircle2, XCircle, Loader2, Terminal, Zap } from 'lucide-react';

export default function BackendTestPanel() {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);

  const tests = [
    { name: 'Health Check', fn: () => glyphLockAPI.health(), key: 'health' },
    { name: 'Generate API Keys', fn: () => glyphLockAPI.keys.generate('Test Key', 'DEV', 'AUTH'), key: 'keys-generate', requiresAuth: true },
    { name: 'List Audit Logs', fn: () => glyphLockAPI.logs.list(), key: 'logs-list', requiresAuth: true },
    { name: 'List Users (Admin)', fn: () => glyphLockAPI.admin.listUsers(), key: 'admin-users', requiresAuth: true, adminOnly: true },
  ];

  const runTest = async (test) => {
    setResults(prev => ({ ...prev, [test.key]: { status: 'loading' } }));
    
    try {
      const result = await test.fn();
      setResults(prev => ({ 
        ...prev, 
        [test.key]: { status: 'success', data: result } 
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [test.key]: { status: 'error', error: error.message } 
      }));
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    for (const test of tests) {
      await runTest(test);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setTesting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'loading': return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="glass-card border-cyan/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Terminal className="w-5 h-5 text-cyan" />
              Backend Function Tests
            </CardTitle>
            <Button 
              onClick={runAllTests} 
              disabled={testing}
              className="bg-gradient-to-r from-cyan to-royal-blue"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-white">
          {tests.map((test) => {
            const result = results[test.key];
            return (
              <div 
                key={test.key}
                className="flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-cyan/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result?.status)}
                  <div>
                    <p className="font-medium">{test.name}</p>
                    <p className="text-xs text-white/50">/{test.key.replace('-', '_')}</p>
                  </div>
                  {test.requiresAuth && (
                    <Badge variant="outline" className="text-xs">Auth Required</Badge>
                  )}
                  {test.adminOnly && (
                    <Badge variant="outline" className="text-xs border-red-400 text-red-400">Admin Only</Badge>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => runTest(test)}
                  disabled={result?.status === 'loading'}
                >
                  Test
                </Button>
              </div>
            );
          })}

          {Object.keys(results).length > 0 && (
            <div className="mt-6 p-4 bg-black/50 rounded-lg border border-white/10">
              <h4 className="font-bold mb-2 text-cyan">Test Results:</h4>
              <pre className="text-xs overflow-auto max-h-64 text-white/70">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}