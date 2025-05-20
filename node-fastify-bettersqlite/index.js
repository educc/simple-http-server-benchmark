const fastify = require('fastify')({ logger: false });
const path = require('path');
const { Eta } = require('eta');
const Database = require('better-sqlite3');

const DB_FILE = process.env.DB_FILE || 'data.db';
const PORT = process.env.PORT || 3000;

const eta = new Eta({ views: path.join(__dirname, 'views') });
let db;

function getRandomId() {
  return Math.floor(Math.random() * 100001) + 1;
}

fastify.get('/plain', async (request, reply) => {
  return { message: 'Hello, world!' };
});

fastify.get('/html-template', async (request, reply) => {
  const html = eta.render('index', { name: 'Ben' });
  reply.type('text/html').send(html);
});

fastify.get('/sqlite/random-5fields/:size', async (request, reply) => {
  const size = parseInt(request.params.size, 10) || 1;
  try {
    const rows = [];
    const query = db.prepare('SELECT * FROM person5 WHERE id = ?');
    for (let i = 0; i < size; i++) {
      const id = getRandomId();
      const row = query.get(id);
      rows.push(row);
    }
    return rows;
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'DB error' });
  }
});

fastify.get('/sqlite/random-30fields/:size', async (request, reply) => {
  const size = parseInt(request.params.size, 10) || 1;
  try {
    const rows = [];
    const query = db.prepare('SELECT * FROM person30 WHERE id = ?');
    for (let i = 0; i < size; i++) {
      const id = getRandomId();
      const row = query.get(id);
      rows.push(row);
    }
    return rows;
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'DB error' });
  }
});

const start = async () => {
  try {
    db = new Database(DB_FILE);
    await fastify.listen({ port: PORT });
    fastify.log.info(`[fastify-bettersqlite] Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
