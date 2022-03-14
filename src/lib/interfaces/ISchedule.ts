import type { ITimeSlot, ITimeSlotRange } from './ITimeSlot';

export interface ISchedule {
  id: number;
  name: string;
  createdAt: string;
  isCurrent: number;
}

export interface IScheduleWithSlots extends ISchedule {
  slots: ITimeSlot[];
}

export interface IScheduleWithSlotRanges extends ISchedule {
  slots: ITimeSlotRange[];
}
