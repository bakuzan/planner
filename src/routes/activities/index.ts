import db from '$lib/database';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
  const items = db.prepare(`SELECT * FROM Activity ORDER BY name`).all();

  return {
    body: { items }
  };
}
