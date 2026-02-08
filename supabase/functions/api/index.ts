import { Hono } from "hono";
import { cors } from "hono/middleware/cors/index.ts";
import { logger } from "hono/middleware/logger/index.ts";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

app.get("/", (c) => {
  return c.json({
    message: "Trip App API",
    endpoints: ["/health", "/test", "/welcome"],
  });
});

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/test", (c) => {
  return c.json({ message: "Hello from Supabase Edge Function!" });
});

app.get("/welcome", (c) => {
  return c.json({
    title: "Trip App",
    message: "旅行アプリへようこそ",
    description: "素敵な旅行を計画しましょう！",
  });
});

// 0.0.0.0 でリッスン（iPhone からアクセスできるように）
Deno.serve({ hostname: "0.0.0.0", port: 8000 }, app.fetch);
