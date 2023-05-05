DROP TABLE IF EXISTS petsTable;
DROP TABLE IF EXISTS userTable;

CREATE TABLE petsTable(
    id SERIAL NOT NULL, 
    name TEXT NOT NULL, 
    age SMALLINT NOT NULL, 
    kind TEXT NOT NULL);

CREATE TABLE userTable(
    id SERIAL NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);