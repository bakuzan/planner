CREATE TABLE IF NOT EXISTS Schedule(
    "id"        INTEGER      PRIMARY KEY, 
    "name"      VARCHAR(255) NOT NULL UNIQUE, 
    "createdAt" DATETIME     NOT NULL, 
    "isCurrent" TINYINT(1)   NOT NULL DEFAULT 0);