const plannerTable = `CREATE TABLE IF NOT EXISTS Schedule(
    "id"        INTEGER      PRIMARY KEY, 
    "name"      VARCHAR(255) NOT NULL UNIQUE, 
    "createdAt" DATETIME     NOT NULL, 
    "isCurrent" TINYINT(1)   NOT NULL DEFAULT 0);`;

const activityTable = `CREATE TABLE IF NOT EXISTS Activity(
    "id"        INTEGER      PRIMARY KEY, 
    "name"      VARCHAR(255) NOT NULL UNIQUE);`;

const timeSlotTable = `CREATE TABLE IF NOT EXISTS TimeSlot(
    "id"            INTEGER      PRIMARY KEY, 
    "slot"          VARCHAR(5)   NOT NULL,
    "scheduleId"    INTEGER      NOT NULL,
    "activityId"    INTEGER      NULL,
    FOREIGN KEY(scheduleId) REFERENCES Schedule(id),
    FOREIGN KEY(activityId) REFERENCES Activity(id));`;

const tables = [plannerTable, activityTable, timeSlotTable].join('\r\n');

export default tables;
