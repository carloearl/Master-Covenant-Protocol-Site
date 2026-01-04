import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Store connections: projectId -> Set<WebSocket>
const projects = new Map();

Deno.serve(async (req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId") || "default";
  
  socket.addEventListener("open", () => {
    if (!projects.has(projectId)) {
      projects.set(projectId, new Set());
    }
    projects.get(projectId).add(socket);
    console.log(`Client connected to project ${projectId}`);
  });

  socket.addEventListener("message", (event) => {
    // Broadcast to all other clients in the same project
    if (projects.has(projectId)) {
      const clients = projects.get(projectId);
      for (const client of clients) {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(event.data);
        }
      }
    }
  });

  socket.addEventListener("close", () => {
    if (projects.has(projectId)) {
      const clients = projects.get(projectId);
      clients.delete(socket);
      if (clients.size === 0) {
        projects.delete(projectId);
      }
    }
  });

  return response;
});