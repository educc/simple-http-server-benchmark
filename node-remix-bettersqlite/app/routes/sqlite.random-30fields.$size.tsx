import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { getDatabase, getRandomId, type Person30 } from "~/utils/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const size = parseInt(params.size || '1', 10);
  
  try {
    const db = getDatabase();
    const rows: Person30[] = [];
    const query = db.prepare('SELECT * FROM person30 WHERE id = ?');
    
    for (let i = 0; i < size; i++) {
      const id = getRandomId();
      const row = query.get(id) as Person30;
      if (row) {
        rows.push(row);
      }
    }
    
    return json(rows);
  } catch (err) {
    console.log(err);
    return json({ error: 'DB error' }, { status: 500 });
  }
}
