export interface ISlot {
  slot: string;
  scheduleId: number;
  activityId: number | null;
}

export interface ITimeSlot extends ISlot {
  id: number;
}
