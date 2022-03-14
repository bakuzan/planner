CREATE TABLE IF NOT EXISTS TimeSlot(
    "id"            INTEGER      PRIMARY KEY, 
    "slot"          VARCHAR(5)   NOT NULL,
    "scheduleId"    INTEGER      NOT NULL,
    "activityId"    INTEGER      NULL,
    FOREIGN KEY(scheduleId) REFERENCES Schedule(id),
    FOREIGN KEY(activityId) REFERENCES Activity(id));