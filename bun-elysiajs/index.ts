import { Elysia } from 'elysia';
import { Eta } from 'eta';
import path from 'path';
import { Database } from 'bun:sqlite';

const DB_FILE = process.env.DB_FILE || 'data.db';
const PORT = process.env.PORT || 3000;

const eta = new Eta({ views: path.join(import.meta.dir, "views") });
const db = new Database(DB_FILE);

function getRandomId(): number {
    return Math.floor(Math.random() * 100000) + 1; // Adjusted to 100000 as per typical DB setup
}

const app = new Elysia()
    .get('/plain', () => ({
        message: 'Hello, world!'
    }))
    .get('/html-template', () => {
        const html = eta.render("index", { name: "Ben" });
        return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    })
    .get('/sqlite/random-5fields/:size', ({ params }) => {
        const size = parseInt(params.size, 10) || 1;
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
            console.error(err);
            return new Response(JSON.stringify({ error: 'DB error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    })
    .get('/sqlite/random-30fields/:size', ({ params }) => {
        const size = parseInt(params.size, 10) || 1;
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
            console.error(err);
            return new Response(JSON.stringify({ error: 'DB error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    })
    .listen(PORT);

console.log(
    `[bun-elysiajs] Server running at http://${app.server?.hostname}:${app.server?.port}`
);
