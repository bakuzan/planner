import db from '$lib/database';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }) {
  const item = db.prepare(`SELECT * FROM Schedule WHERE id = ?`).get(params.id);

  if (item) {
    return {
      body: { item }
    };
  }

  return {
    status: 404
  };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function del({ params }) {
  console.log('delete...', params);
  const info = db.prepare(`DELETE FROM Schedule WHERE id = ?`).run(params.id);

  if (!info.changes) {
    // return validation errors
    return {
      status: 500,
      body: { errors: [`Delete Schedule Failed`] }
    };
  }

  return {
    status: 303,
    headers: {
      location: `/`
    }
  };
}
