export interface ISlot {
  slot: string;
  scheduleId: number;
  activityId: number | null;
}

export interface ITimeSlot extends ISlot {
  id: number;
}

export interface ITimeSlotRange extends ITimeSlot {
  activityName: string;
  backgroundColour: string;
  endSlot: string;
  slotCount: number;
}

export interface IBlock extends Omit<ITimeSlot, 'activityId'> {
  activityId: number | string;
}
