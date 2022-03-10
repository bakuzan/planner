import db from '$lib/database';
import { formatDate } from '$lib/formatters';
import generateDefaultBlocks from '$lib/generateDefaultBlocks';
import type { ISlot } from '$lib/interfaces/ITimeSlot';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
  const items = db
    .prepare(`SELECT * FROM Schedule ORDER BY createdAt DESC`)
    .all();

  return {
    body: { items }
  };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  if (!data.name || !data.name.trim()) {
    return {
      status: 400,
      body: { errors: [`Schedule Name is required`] }
    };
  }

  const name = data.name.trim();
  const item = db.prepare(`SELECT 1 FROM Schedule WHERE name = ?`).get(name);
  if (item) {
    // todo send the user back
    return {
      status: 400,
      body: { errors: [`Schedule '${name}' already exists`] }
    };
  }

  const insertSchedule = db.prepare(
    `INSERT INTO Schedule(name, createdAt, isCurrent) VALUES (@name, @createdAt, @isCurrent)`
  );

  const info = insertSchedule.run({
    name,
    createdAt: formatDate(),
    isCurrent: 0
  });

  if (!info.changes) {
    // return validation errors
    return {
      status: 500,
      body: { errors: [`Create Schedule Failed`] }
    };
  }

  const scheduleId = info.lastInsertRowid as number;
  const insertSlot = db.prepare(
    `INSERT INTO TimeSlot(slot, scheduleId, activityId) VALUES(@slot, @scheduleId, @activityId)`
  );

  const insertSlots = db.transaction((slots: ISlot[]) => {
    for (const slot of slots) {
      insertSlot.run(slot);
    }
  });

  insertSlots(generateDefaultBlocks(scheduleId));

  // redirect to the newly created item
  return {
    status: 303,
    headers: {
      location: `/schedules/${scheduleId}`
    }
  };
}
