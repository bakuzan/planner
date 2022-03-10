import db from '$lib/database';
import type { ITimeSlot } from '$lib/interfaces/ITimeSlot';

const SCHEDULE_FORM_TIMESLOT_PREPEND = 'eventOption_';

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
    .prepare(`SELECT * FROM TimeSlot WHERE scheduleId = ? ORDER BY slot`)
    .all(params.id);

  return {
    body: { item: { ...item, slots } }
  };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function put({ params, request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const scheduleId = params.id;
  const item = db
    .prepare(`SELECT * FROM Schedule WHERE id = ?`)
    .get(scheduleId);

  if (!item) {
    return {
      status: 404,
      body: { errors: [`Schedule not found`] }
    };
  }

  if (!data.name || !data.name.trim()) {
    return {
      status: 400,
      body: { errors: [`Schedule Name is required`] }
    };
  }

  const name = data.name.trim();
  const info = db
    .prepare(`UPDATE Schedule SET name = @name WHERE id = @scheduleId`)
    .run({ name, scheduleId });

  if (!info.changes) {
    // return validation errors
    return {
      status: 500,
      body: { errors: [`Update Schedule Failed`] }
    };
  }

  const slotKeys = Object.keys(data).filter((key) =>
    key.startsWith(SCHEDULE_FORM_TIMESLOT_PREPEND)
  );

  const updateSlot = db.prepare(
    `UPDATE TimeSlot SET activityId = @activityId WHERE scheduleId = @scheduleId AND slot = @slot`
  );
  const updateTimeSlots = db.transaction((slots: Partial<ITimeSlot>[]) => {
    for (const slot of slots) {
      updateSlot.run({
        activityId: slot.activityId,
        slot: slot.slot,
        scheduleId
      });
    }
  });

  updateTimeSlots(
    slotKeys.map((key) => ({
      slot: key.replace(SCHEDULE_FORM_TIMESLOT_PREPEND, ''),
      activityId: data[key] || null
    }))
  );

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
