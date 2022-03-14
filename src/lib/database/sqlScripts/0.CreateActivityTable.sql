CREATE TABLE IF NOT EXISTS Activity(
    "id"                INTEGER      PRIMARY KEY, 
    "name"              VARCHAR(255) NOT NULL UNIQUE,
    "backgroundColour"  VARCHAR(255) NOT NULL,
    "colour"            VARCHAR(255) NOT NULL);