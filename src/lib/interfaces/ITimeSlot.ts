export interface ITimeSlot {
  id: number;
  slot: string;
  scheduleId: number;
  activityId: number | null;
}
