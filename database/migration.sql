DROP TABLE IF EXISTS petsTable;

CREATE TABLE petsTable(
    id SERIAL NOT NULL, 
    name TEXT, 
    age SMALLINT, 
    kind TEXT);