// Local stand-in for Vercel's serverless functions, so `npm run dev` works without the Vercel CLI.
// Every api/<name>.ts file is served at /api/<name>, same as on Vercel.
import express from "express";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Same env file Vite reads; server-only keys (no VITE_ prefix) live here too.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const port = Number(process.env.API_PORT || 8080);
const apiDir = path.resolve("api");
const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

for (const file of readdirSync(apiDir)) {
  if (!file.endsWith(".ts") || file.startsWith("_")) continue;
  const route = `/api/${file.replace(/\.ts$/, "")}`;

  app.all(route, async (req, res) => {
    try {
      const mod = await import(pathToFileURL(path.join(apiDir, file)).href);
      await mod.default(req, res);
    } catch (err) {
      console.error(`Error in ${route}:`, err);
      if (!res.headersSent) res.status(500).json({ error: "Local API error" });
    }
  });
  console.log(`  ${route}`);
}

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
