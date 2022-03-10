import db from '$lib/database';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }) {
  const item = db.prepare(`SELECT * FROM Schedule WHERE id = ?`).get(params.id);

  if (!item) {
    return {
      status: 404,
      body: { errors: [`Schedule not found`] }
    };
  }

  const slots = db
    .prepare(`SELECT * FROM TimeSlot WHERE scheduleId = ?`)
    .all(params.id);

  return {
    body: { item: { ...item, slots } }
  };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function put({ params, request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const item = db.prepare(`SELECT * FROM Schedule WHERE id = ?`).get(params.id);

  if (!item) {
    return { status: 404, body: { errors: [`Schedule not found`] } };
  }

  const slots = db
    .prepare(`SELECT * FROM TimeSlot WHERE scheduleId = ?`)
    .all(params.id);

  console.log('PUT > ', params, item, data, slots);
  return {
    status: 303,
    headers: {
      location: `/schedules/${item.id}`
    }
  };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function del({ params }) {
  console.log('delete...', params);

  const slotsInfo = db
    .prepare(`DELETE FROM TimeSlot WHERE scheduleId = ?`)
    .run(params.id);

  const scheduleInfo = db
    .prepare(`DELETE FROM Schedule WHERE id = ?`)
    .run(params.id);

  if (!scheduleInfo.changes || !slotsInfo.changes) {
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
