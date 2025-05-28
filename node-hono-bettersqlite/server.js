import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Eta } from 'eta';
import path from 'node:path';
import Database from 'better-sqlite3';

const DB_FILE = process.env.DB_FILE || 'data.db';
const PORT = process.env.PORT || 3000;

const eta = new Eta({ views: path.join(process.cwd(), 'views') });
const db = new Database(DB_FILE, { readonly: true });

function getRandomId() {
  return Math.floor(Math.random() * 100001) + 1;
}

const app = new Hono();

app.get('/plain', (c) => {
  return c.json({ message: 'Hello, world!' });
});

app.get('/html-template', async (c) => {
  const html = await eta.render('index', { name: 'Ben' });
  return c.html(html || '');
});

app.get('/sqlite/random-5fields/:size', (c) => {
  const size = parseInt(c.req.param('size'), 10) || 1;
  try {
    const rows = [];
    const query = db.prepare('SELECT * FROM person5 WHERE id = ?');
    for (let i = 0; i < size; i++) {
      const id = getRandomId();
      const row = query.get(id);
      if (row) rows.push(row);
    }
    return c.json(rows);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'DB error' }, 500);
  }
});

app.get('/sqlite/random-30fields/:size', (c) => {
  const size = parseInt(c.req.param('size'), 10) || 1;
  try {
    const rows = [];
    const query = db.prepare('SELECT * FROM person30 WHERE id = ?');
    for (let i = 0; i < size; i++) {
      const id = getRandomId();
      const row = query.get(id);
      if (row) rows.push(row);
    }
    return c.json(rows);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'DB error' }, 500);
  }
});

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`[hono] Server running at http://localhost:${PORT}/`);
});
