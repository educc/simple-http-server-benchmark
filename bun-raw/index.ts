// server.ts
import { serve } from "bun";
import Database from "bun:sqlite";
import { Eta } from "eta";
import { join } from "path";

const DB_FILE = process.env.DB_FILE ?? "data.db";
const PORT = parseInt(process.env.PORT ?? "3000", 10);

// Resolve views directory relative to this file
const __dirname = new URL(".", import.meta.url).pathname;
const eta = new Eta({ views: join(__dirname, "views") });

// Initialize SQLite database
const db = new Database(DB_FILE);

function getRandomId(): number {
  return Math.floor(Math.random() * 100001) + 1;
}

serve({
  port: PORT,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const { pathname } = url;

    // GET /plain
    if (req.method === "GET" && pathname === "/plain") {
      return new Response(JSON.stringify({ message: "Hello, world!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // GET /html-template
    if (req.method === "GET" && pathname === "/html-template") {
      const html = eta.render("index", { name: "Ben" }) ?? "";
      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    // GET /sqlite/random-5fields/:size
    if (req.method === "GET" && pathname.startsWith("/sqlite/random-5fields/")) {
      const size = parseInt(pathname.split("/").pop() ?? "1", 10) || 1;
      try {
        const stmt = db.prepare("SELECT * FROM person5 WHERE id = ?");
        const rows: Record<string, any>[] = [];
        for (let i = 0; i < size; i++) {
          const id = getRandomId();
          // .get() returns the first matching row
          const row = stmt.get(id);
          rows.push(row);
        }
        return new Response(JSON.stringify(rows), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "DB error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // GET /sqlite/random-30fields/:size
    if (req.method === "GET" && pathname.startsWith("/sqlite/random-30fields/")) {
      const size = parseInt(pathname.split("/").pop() ?? "1", 10) || 1;
      try {
        const stmt = db.prepare("SELECT * FROM person30 WHERE id = ?");
        const rows: Record<string, any>[] = [];
        for (let i = 0; i < size; i++) {
          const id = getRandomId();
          const row = stmt.get(id);
          rows.push(row);
        }
        return new Response(JSON.stringify(rows), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "DB error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 404 for everything else
    return new Response("Not found", { status: 404 });
  },
});

console.log(`[bun-raw] Server running at http://localhost:${PORT}/`);