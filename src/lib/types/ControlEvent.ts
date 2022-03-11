export type ControlEvent<T extends HTMLElement> = Event & {
  currentTarget: EventTarget & T;
};
