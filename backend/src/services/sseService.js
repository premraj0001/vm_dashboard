export const latestVehicleData = {};
const activeConnections = new Set();

export const ensureSSEConnection = (tractorId) => {
  if (!activeConnections.has(tractorId)) {
    console.log(`Starting SSE for ${tractorId}`);
    activeConnections.add(tractorId);
    connectSSE(tractorId);
  }
};

async function connectSSE(tractorId) {
  const url = `${process.env.SSE_BASE_URL}?name=${tractorId}`;

  try {
    console.log(`Connecting SSE for ${tractorId}`);

    const response = await fetch(url, {
      headers: { Accept: "text/event-stream" },
    });
   
    if (!response.ok || !response.body) {
      throw new Error(`SSE failed for ${tractorId}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        console.log(`SSE closed for ${tractorId}, reconnecting...`);
        reconnect(tractorId);
        break;
      }

      if (!value) continue;

      buffer += decoder.decode(value, { stream: true });
      
      const lines = buffer.split("\n");
      
      buffer = lines.pop(); 

      for (let line of lines) {
        if (line.startsWith("data:")) {
          try {
            const json = JSON.parse(line.replace("data:", "").trim());

            latestVehicleData[tractorId] = json;

          } catch (err) {
            console.log(`Parse error for ${tractorId}:`, err.message);
          }
        }
      }
    }

  } catch (err) {
    console.log(`❌ SSE error for ${tractorId}:`, err.message);
    reconnect(tractorId);
  }
}

function reconnect(tractorId) {
  setTimeout(() => {
    console.log(`Reconnecting SSE for ${tractorId}...`);
    connectSSE(tractorId);
  }, 3000);
}