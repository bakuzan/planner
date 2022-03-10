import type { ITimeSlot } from './ITimeSlot';

export interface ISchedule {
  id: number;
  name: string;
  createdAt: string;
  isCurrent: number;
}

export interface IScheduleWithSlots extends ISchedule {
  slots: ITimeSlot[];
}
