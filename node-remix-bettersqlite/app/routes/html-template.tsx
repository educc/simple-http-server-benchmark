import { type LoaderFunctionArgs } from "@remix-run/node";
import { Eta } from 'eta';
import path from 'path';

const eta = new Eta({ views: path.join(process.cwd(), "app/views") });

export async function loader({ request }: LoaderFunctionArgs) {
  const html = eta.render("index", { name: "Ben" });
  
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
