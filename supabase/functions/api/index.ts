import { Hono } from "hono";
import { cors } from "hono/middleware/cors/index.ts";
import { logger } from "hono/middleware/logger/index.ts";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/test", (c) => {
  return c.json({ message: "Hello from Supabase Edge Function!" });
});

Deno.serve(app.fetch);
