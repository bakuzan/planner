import db from '$lib/database';
import { formatDate } from '$lib/formatters';
import generateDefaultBlocks from '$lib/generateDefaultBlocks';
import type {
  ISchedule,
  IScheduleWithSlotRanges
} from '$lib/interfaces/ISchedule';
import type { ISlot, ITimeSlotRange } from '$lib/interfaces/ITimeSlot';
import { getRequestData, sendErrorResponse } from '$lib/utils';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url }) {
  const includeCurrentItems = url.searchParams.get('includeCurrentItems');

  const items: ISchedule[] = db
    .prepare(`SELECT * FROM Schedule ORDER BY createdAt DESC`)
    .all();

  let currentItems: IScheduleWithSlotRanges[] = [];
  if (includeCurrentItems) {
    const currents = items.filter((x) => x.isCurrent);
    const currentSlots: ITimeSlotRange[] = db
      .prepare(
        `SELECT t.*, a.name activityName, a.backgroundColour, t.slot 'endSlot', 1 'slotCount'
           FROM TimeSlot t 
           JOIN Schedule s ON t.scheduleId = s.id
           LEFT JOIN Activity a ON t.activityId = a.id
          WHERE s.isCurrent = 1
          ORDER BY t.scheduleId, t.slot`
      )
      .all();

    currentItems = currents.map((x) => ({
      ...x,
      slots: currentSlots
        .filter((c) => c.scheduleId === x.id)
        .reduce((p, c, i, a) => {
          const prevIndex = p.length - 1;
          const prev = p[prevIndex];
          const next = a[i + 1];

          if (prev && prev.activityId === c.activityId) {
            prev.endSlot = next ? c.slot : '00:00';
            prev.slotCount += 1;
            return [...p];
          } else if (prev) {
            prev.endSlot = c.slot;
          }

          const endSlot = next ? next.slot : '00:00';
          return [...p, { ...c, endSlot }];
        }, [] as ITimeSlotRange[])
    }));
  }

  return {
    body: { items, currentItems }
  };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
  const data = await getRequestData(request);

  if (!data.name || !data.name.trim()) {
    return sendErrorResponse(400, `Schedule Name is required`);
  }

  const name = data.name.trim();
  const item = db.prepare(`SELECT 1 FROM Schedule WHERE name = ?`).get(name);
  if (item) {
    return sendErrorResponse(400, `Schedule '${name}' already exists`);
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
    return sendErrorResponse(500, `Create Schedule Failed`);
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
