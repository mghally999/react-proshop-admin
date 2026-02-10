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

async function main() {
  await connectDB();
  await ensureSeedAdmin();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`[server] http://localhost:${env.PORT}`);
    console.log(`[server] session ttl (min): ${env.SESSION_TTL_MINUTES}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
