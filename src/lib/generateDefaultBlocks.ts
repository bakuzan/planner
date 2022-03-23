import type { ISlot, ITimeSlot } from './interfaces/ITimeSlot';

function formatNumberAsTime(num: number) {
  const begin = `${num}`.padStart(2, '0');
  return `${begin}:00`;
}

export default function generateDefaultBlocks(
  scheduleId: number,
  templateSlots: ITimeSlot[]
): ISlot[] {
  const hours = Array(24)
    .fill(1)
    .map((_, i) => formatNumberAsTime(i));

  return hours.reduce((p, slot) => {
    const slot30 = slot.replace(':00', ':30');
    const slotFirst = templateSlots.find((x) => x.slot === slot);
    const slotSecond = templateSlots.find((x) => x.slot === slot30);

    return [
      ...p,
      { slot, scheduleId, activityId: slotFirst?.activityId },
      { slot: slot30, scheduleId, activityId: slotSecond?.activityId }
    ];
  }, []);
}
