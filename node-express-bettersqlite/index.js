const express = require('express');
const { Eta } = require('eta');
const path = require('path');
const Database = require('better-sqlite3');

const DB_FILE = process.env.DB_FILE || 'data.db';
const PORT = process.env.PORT || 3000;

const app = express();
const eta = new Eta({ views: path.join(__dirname, 'views') });
const db = new Database(DB_FILE);

function getRandomId() {
  return Math.floor(Math.random() * 100001) + 1;
}

app.get('/plain', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.get('/html-template', (req, res) => {
  const html = eta.render('index', { name: 'Ben' });
  res.send(html);
});

app.get('/sqlite/random-5fields/:size', (req, res) => {
  const size = parseInt(req.params.size, 10) || 1;
  try {
    const rows = [];
    const query = db.prepare('SELECT * FROM person5 WHERE id = ?');
    for (let i = 0; i < size; i++) {
      const id = getRandomId();
      const row = query.get(id);
      rows.push(row);
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/sqlite/random-30fields/:size', (req, res) => {
  const size = parseInt(req.params.size, 10) || 1;
  try {
    const rows = [];
    const query = db.prepare('SELECT * FROM person30 WHERE id = ?');
    for (let i = 0; i < size; i++) {
      const id = getRandomId();
      const row = query.get(id);
      rows.push(row);
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.listen(PORT, () => {
  console.log(`[node-express-bettersqlite] Server running at http://localhost:${PORT}/`);
});
