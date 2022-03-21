import db from '$lib/database';
import type { ITimeSlot } from '$lib/interfaces/ITimeSlot';
import { fromBoolToBit, getRequestData, sendErrorResponse } from '$lib/utils';

const SCHEDULE_FORM_TIMESLOT_PREPEND = 'eventOption_';

/** @type {import('./[id]').RequestHandler} */
export async function get({ params }) {
  const item = db.prepare(`SELECT * FROM Schedule WHERE id = ?`).get(params.id);

  if (!item) {
    return sendErrorResponse(404, `Schedule not found`);
  }

  const slots = db
    .prepare(`SELECT * FROM TimeSlot WHERE scheduleId = ? ORDER BY slot`)
    .all(params.id);

  return {
    body: { item: { ...item, slots } }
  };
}

/** @type {import('./[id]').RequestHandler} */
export async function put({ params, request }) {
  const data = await getRequestData(request);

  const scheduleId = params.id;
  const item = db
    .prepare(`SELECT * FROM Schedule WHERE id = ?`)
    .get(scheduleId);

  if (!item) {
    return sendErrorResponse(404, `Schedule not found`);
  }

  if (!data.name || !data.name.trim()) {
    return sendErrorResponse(400, `Schedule Name is required`);
  }

  const name = data.name.trim();
  const otherItemWithSameName = db
    .prepare(`SELECT 1 FROM Schedule WHERE id <> @id AND name = @name`)
    .get({ id: item.id, name });

  if (otherItemWithSameName) {
    return sendErrorResponse(400, `Schedule '${name}' already exists`);
  }

  const isCurrent = fromBoolToBit(data.isCurrent);
  const info = db
    .prepare(
      `UPDATE Schedule 
          SET name = @name
            , isCurrent = @isCurrent 
        WHERE id = @scheduleId`
    )
    .run({ name, isCurrent, scheduleId });

  if (!info.changes) {
    return sendErrorResponse(500, `Update Schedule Failed`);
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

/** @type {import('./[id]').RequestHandler} */
export async function del({ params }) {
  const slotsInfo = db
    .prepare(`DELETE FROM TimeSlot WHERE scheduleId = ?`)
    .run(params.id);

  const scheduleInfo = db
    .prepare(`DELETE FROM Schedule WHERE id = ?`)
    .run(params.id);

  if (!scheduleInfo.changes || !slotsInfo.changes) {
    return sendErrorResponse(500, `Delete Schedule Failed`);
  }

  return {
    status: 303,
    headers: {
      location: `/`
    }
  };
}
