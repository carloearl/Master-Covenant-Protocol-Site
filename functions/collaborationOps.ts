import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { action, sessionId, data } = body;

        // --- JOIN SESSION ---
        if (action === 'join') {
            const { projectId } = data;
            const sessionKey = `collab_${projectId}`;
            
            // In a real Redis/WebSocket scenario, we'd subscribe here.
            // For DB-backed:
            let session = await base44.entities.CollaborationSession.filter({ projectId });
            
            if (session.length === 0) {
                // Create new session
                await base44.entities.CollaborationSession.create({
                    projectId,
                    hostId: user.id,
                    activeUsers: [user.email],
                    currentState: data.initialState || {},
                    lastUpdate: new Date().toISOString()
                });
            } else {
                // Update existing
                const s = session[0];
                const activeUsers = new Set([...(s.activeUsers || []), user.email]);
                await base44.entities.CollaborationSession.update(s.id, {
                    activeUsers: Array.from(activeUsers),
                    lastUpdate: new Date().toISOString()
                });
            }

            return Response.json({ success: true, sessionId: sessionKey });
        }

        // --- SYNC STATE (Heartbeat & Update) ---
        if (action === 'sync') {
            // "Last Write Wins" Strategy for simple object merge
            const { projectId, changes } = data;
            const sessions = await base44.entities.CollaborationSession.filter({ projectId });
            
            if (sessions.length > 0) {
                const s = sessions[0];
                const newState = { ...s.currentState, ...changes };
                
                await base44.entities.CollaborationSession.update(s.id, {
                    currentState: newState,
                    lastUpdate: new Date().toISOString(),
                    // Update active user timestamp implicitly by refreshing 'activeUsers' if needed (skipped for brevity)
                });
                
                return Response.json({ 
                    success: true, 
                    state: newState, 
                    users: s.activeUsers 
                });
            }
        }

        // --- LEAVE SESSION ---
        if (action === 'leave') {
            const { projectId } = data;
            const sessions = await base44.entities.CollaborationSession.filter({ projectId });
            if (sessions.length > 0) {
                const s = sessions[0];
                const activeUsers = (s.activeUsers || []).filter(u => u !== user.email);
                await base44.entities.CollaborationSession.update(s.id, { activeUsers });
            }
            return Response.json({ success: true });
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});