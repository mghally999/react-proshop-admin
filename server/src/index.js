import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load server/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";
import { ensureSeedAdmin } from "./modules/auth/auth.service.js";
import http from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { setIO } from "./realtime/realtime.js";

async function main() {
  await connectDB();
  await ensureSeedAdmin();

  const app = createApp();
  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // For demo: we keep it open. Auth can be added later via cookie/session.
    socket.emit("connected", { ok: true });
  });

  setIO(io);

  server.listen(env.PORT, () => {
    console.log(`[server] http://localhost:${env.PORT}`);
    console.log(`[server] session ttl (min): ${env.SESSION_TTL_MINUTES}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
