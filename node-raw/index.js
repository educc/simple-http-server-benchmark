const http = require('http');
const {Eta} = require('eta');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DB_FILE = process.env.DB_FILE || 'data.db';

const eta = new Eta({ views: path.join(__dirname, "views") })

let db;

function getRandomId() {
  return Math.floor(Math.random() * 100001) + 1;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/plain') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello, world!' }));
    return;
  }

  if (req.method === 'GET' && req.url === '/html-template') {
    const html = eta.render("index", { name: "Ben" })
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/sqlite/random-5fields/')) {
    const size = parseInt(req.url.split('/').pop(), 10) || 1;
    try {
      const rows = [];
      const query = db.prepare('SELECT * FROM person5 WHERE id = ?');
      for(let i = 0; i < size; i++) {
        const id = getRandomId();
        const row = query.get(id);
        rows.push(row);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
    } catch (err) {
      console.log(err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'DB error' }));
    }
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/sqlite/random-30fields/')) {
    const size = parseInt(req.url.split('/').pop(), 10) || 1;
    try {
      const rows = [];
      const query = db.prepare('SELECT * FROM person30 WHERE id = ?');
      for(let i = 0; i < size; i++) {
        const id = getRandomId();
        const row = query.get(id);
        rows.push(row);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
    } catch (err) {
      console.log(err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'DB error' }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const PORT = process.env.PORT || 3000;
(async () => {
  db = new DatabaseSync(DB_FILE);
  server.listen(PORT, () => {
    console.log(`[node-raw] Server running at http://localhost:${PORT}/`);
  });
})();