import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.14.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Force refresh
    const testResults = {
      timestamp: new Date().toISOString(),
      testExecutor: user.email,
      tests: []
    };

    // Helper to run a test block
    const runTest = async (name, fn) => {
        try {
            const details = await fn();
            testResults.tests.push({ name, status: 'PASS', details });
        } catch (error) {
            testResults.tests.push({ name, status: 'FAIL', error: error.message });
        }
    };

    // 1. Base44 Authentication
    await runTest('Base44 Authentication', async () => {
        const authTest = await base44.auth.isAuthenticated();
        if (!authTest) throw new Error('Not authenticated');
        return { authenticated: true, userEmail: user.email };
    });

    // 2. Entity CRUD Operations
    await runTest('Entity CRUD Operations', async () => {
        const testLog = await base44.entities.SystemAuditLog.create({
            event_type: 'INTEGRATION_TEST',
            description: 'Testing entity create operation',
            actor_email: user.email,
            resource_id: 'test-integration',
            status: 'success'
        });
        const logs = await base44.entities.SystemAuditLog.filter({ event_type: 'INTEGRATION_TEST' });
        await base44.entities.SystemAuditLog.delete(testLog.id);
        return { created: !!testLog.id, retrieved: logs.length > 0, deleted: true };
    });

    // 3. Stripe API Connection
    await runTest('Stripe API Connection', async () => {
        const balance = await stripe.balance.retrieve();
        return { currency: balance.available[0]?.currency };
    });

    // 4. Core LLM Integration
    await runTest('Core LLM Integration', async () => {
        const llmTest = await base44.integrations.Core.InvokeLLM({
            prompt: 'Respond with exactly: "Integration test successful"'
        });
        if (!llmTest) throw new Error('No response from LLM');
        return { responseReceived: true, responseLength: llmTest.length };
    });

    // 5. Email Integration
    await runTest('Email Integration', async () => {
        await base44.integrations.Core.SendEmail({
            to: user.email,
            subject: 'GlyphLock Integration Test',
            body: 'This is an automated test email. All systems operational.'
        });
        return { sentTo: user.email };
    });

    // 6. File Upload Integration
    await runTest('File Upload Integration', async () => {
        const testBlob = new Blob(['Test file content'], { type: 'text/plain' });
        const testFile = new File([testBlob], 'test.txt');
        const { file_url } = await base44.integrations.Core.UploadFile({ file: testFile });
        if (!file_url) throw new Error('No file URL returned');
        return { fileUrl: file_url };
    });

    // 7. Service Role Access
    await runTest('Service Role Access', async () => {
        const allUsers = await base44.asServiceRole.entities.User.list();
        return { userCount: allUsers.length };
    });

    // NEW SECURITY TESTS (Omega Protocol)

    // 8. Secure QR Generation
    await runTest('Secure QR Generation', async () => {
        const keys = await base44.entities.QRKeyRegistry.list();
        if (keys.length === 0) await base44.functions.invoke('qr/initializeKeys');
        
        const { data } = await base44.functions.invoke('qr/generate', {
            type: 'identity',
            claims: { userId: 'test-user', email: 'test@glyphlock.io' }
        });
        if (data.error) throw new Error(data.error);
        
        testResults.tempQR = data.signedPayload; 
        return { qrId: data.qrId, type: 'identity' };
    });

    // 9. Secure QR Verification
    await runTest('Secure QR Verification', async () => {
        if (!testResults.tempQR) throw new Error('Skipped: QR Generation failed');
        const { data } = await base44.functions.invoke('qr/scan', {
            qrData: testResults.tempQR
        });
        if (data.error) throw new Error(data.error);
        if (!data.success) throw new Error('Verification returned false');
        return { verified: true, kid: data.payload.kid };
    });

    // 10. Asset Registration
    await runTest('Asset Registration', async () => {
        const testHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // empty sha256
        const { data } = await base44.functions.invoke('assets/register', {
            assetHash: testHash,
            metadata: { watermarkType: 'invisible' }
        });
        if (data.error) throw new Error(data.error);
        
        testResults.tempAsset = { hash: data.assetHash, sig: data.signature, kid: data.kid };
        return { traceId: data.traceId, signed: true };
    });

    // 11. Asset Verification
    await runTest('Asset Verification', async () => {
        if (!testResults.tempAsset) throw new Error('Skipped: Asset Reg failed');
        const { data } = await base44.functions.invoke('assets/verify', {
            assetHash: testResults.tempAsset.hash,
            signature: testResults.tempAsset.sig,
            kid: testResults.tempAsset.kid
        });
        if (data.error) throw new Error(data.error);
        if (!data.valid) throw new Error('Signature invalid');
        if (!data.registered) throw new Error('Asset not found in ledger');
        return { verified: true, ledgerCheck: 'PASS' };
    });

    // 12. GlyphBot Hardening
    await runTest('GlyphBot Secure Chat', async () => {
        const { data } = await base44.functions.invoke('glyphbot/secureChat', {
            messages: [{ role: 'user', content: 'Hello, are you compliant?' }],
            securityLevel: 'nist'
        });
        if (data.error) throw new Error(data.error);
        return { mode: data.securityContext.mode, audited: data.securityContext.audited };
    });

    // 13. Compliance Report Gen
    await runTest('Compliance Report Gen', async () => {
        const { data } = await base44.functions.invoke('reports/generateCompliance');
        if (data.error) throw new Error(data.error);
        return { status: data.complianceStatus, sections: Object.keys(data.sections).length };
    });

    // Cleanup temp data
    delete testResults.tempQR;
    delete testResults.tempAsset;

    // Calculate summary
    const totalTests = testResults.tests.length;
    const passedTests = testResults.tests.filter(t => t.status === 'PASS').length;
    const failedTests = testResults.tests.filter(t => t.status === 'FAIL').length;
    
    testResults.summary = {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      successRate: `${Math.round((passedTests / totalTests) * 100)}%`,
      overallStatus: failedTests === 0 ? 'ALL SYSTEMS OPERATIONAL' : 'ISSUES DETECTED'
    };

    // Log test execution
    await base44.entities.SystemAuditLog.create({
      event_type: 'INTEGRATION_TEST_RUN',
      description: `Full suite executed: ${passedTests}/${totalTests} passed`,
      actor_email: user.email,
      resource_id: 'omega-tests',
      metadata: testResults.summary,
      status: failedTests === 0 ? 'success' : 'failure'
    });

    return Response.json(testResults);

  } catch (error) {
    console.error('Test Integration Error:', error);
    return Response.json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});