/** @jsx jsx */
import { Hono } from 'hono';
import { serve } from 'bun';
import { Database } from 'bun:sqlite';
import { Eta } from 'eta';
import { jsx } from 'hono/jsx';
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

// JSX Component for rendering person data
function PersonTable({ persons }: { persons: any[] }) {
  return (
    <html>
      <head>
        <title>Person Data</title>
        <style>
          {`
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          `}
        </style>
      </head>
      <body>
        <h1>Person Data (30 Fields)</h1>
        <p>Found {persons.length} records</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip Code</th>
              <th>Country</th>
              <th>Occupation</th>
              <th>Company</th>
              <th>Salary</th>
              <th>Education Level</th>
              <th>Marital Status</th>
              <th>Children</th>
              <th>Height (cm)</th>
              <th>Weight (kg)</th>
              <th>Blood Type</th>
              <th>Eye Color</th>
              <th>Hair Color</th>
              <th>Favorite Color</th>
              <th>Hobbies</th>
              <th>Languages</th>
              <th>SSN</th>
              <th>Passport</th>
              <th>Driver License</th>
              <th>Emergency Contact</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person: any, index: number) => (
              <tr key={index}>
                <td>{person.id}</td>
                <td>{person.first_name}</td>
                <td>{person.last_name}</td>
                <td>{person.email}</td>
                <td>{person.phone}</td>
                <td>{person.date_of_birth}</td>
                <td>{person.gender}</td>
                <td>{person.address}</td>
                <td>{person.city}</td>
                <td>{person.state}</td>
                <td>{person.zip_code}</td>
                <td>{person.country}</td>
                <td>{person.occupation}</td>
                <td>{person.company}</td>
                <td>{person.salary}</td>
                <td>{person.education_level}</td>
                <td>{person.marital_status}</td>
                <td>{person.number_of_children}</td>
                <td>{person.height_cm}</td>
                <td>{person.weight_kg}</td>
                <td>{person.blood_type}</td>
                <td>{person.eye_color}</td>
                <td>{person.hair_color}</td>
                <td>{person.favorite_color}</td>
                <td>{person.hobbies}</td>
                <td>{person.languages}</td>
                <td>{person.social_security_number}</td>
                <td>{person.passport_number}</td>
                <td>{person.driver_license}</td>
                <td>{person.emergency_contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </body>
    </html>
  );
}

app.get('/sqlite-jsx/random-30fields/:size', (c) => {
  const size = parseInt(c.req.param('size'), 10) || 1;
  const rows = [];
  const stmt = db.query('SELECT * FROM person30 WHERE id = ?');
  for (let i = 0; i < size; i++) {
    const id = getRandomId();
    const row = stmt.get(id);
    rows.push(row);
  }
  return c.html(<PersonTable persons={rows} />);
});

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`[bun-hono] Server running at http://localhost:${PORT}/`);
