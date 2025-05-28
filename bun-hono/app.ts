import { Hono } from 'hono';
import { serve } from 'bun';
import { Database } from 'bun:sqlite';
import { Eta } from 'eta';
import path from 'path';

const DB_FILE = process.env.DB_FILE || 'data.db';
const PORT = process.env.PORT || 3000;

const db = new Database(DB_FILE);

const eta = new Eta({ views: path.join(process.cwd(), 'views') });

function getRandomId() {
  return Math.floor(Math.random() * 100001) + 1;
}

const app = new Hono();

app.get('/plain', (c) => {
  return c.json({ message: 'Hello, world!' });
});

app.get('/html-template', async (c) => {
  const html = await eta.render('index', { name: 'Ben' });
  return c.html(html);
});

app.get('/sqlite/random-5fields/:size', (c) => {
  const size = parseInt(c.req.param('size'), 10) || 1;
  const rows = [];
  const stmt = db.query('SELECT * FROM person5 WHERE id = ?');
  for (let i = 0; i < size; i++) {
    const id = getRandomId();
    const row = stmt.get(id);
    rows.push(row);
  }
  return c.json(rows);
});

app.get('/sqlite/random-30fields/:size', (c) => {
  const size = parseInt(c.req.param('size'), 10) || 1;
  const rows = [];
  const stmt = db.query('SELECT * FROM person30 WHERE id = ?');
  for (let i = 0; i < size; i++) {
    const id = getRandomId();
    const row = stmt.get(id);
    rows.push(row);
  }
  return c.json(rows);
});

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`[bun-hono] Server running at http://localhost:${PORT}/`);
