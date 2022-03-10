import type { ISlot } from './interfaces/ITimeSlot';

function formatNumberAsTime(num: number) {
  const begin = `${num}`.padStart(2, '0');
  return `${begin}:00`;
}

export default function generateDefaultBlocks(scheduleId: number): ISlot[] {
  const hours = Array(24)
    .fill(1)
    .map((_, i) => formatNumberAsTime(i));

  return hours.reduce(
    (p, slot) => [
      ...p,
      { slot, scheduleId, activityId: null },
      { slot: slot.replace(':00', ':30'), scheduleId, activityId: null }
    ],
    []
  );
}
