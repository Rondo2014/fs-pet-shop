import express from "express";
import postgres from "postgres";

// connection to database pets
const sql = postgres("postgres://jovi:123@localhost:5432/pets");

const app = express();
app.use(express.json());
// error handler
app.use((err, req, res, next) => {
  res.status(500).send("Internal servor error");
});

// pet routes for router middleware
export const getAllPets = async (req, res, next) => {
  try {
    const pets = await sql`SELECT * FROM petsTable;`;
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(pets);
  } catch (err) {
    next(err);
  }
};

export const addPet = async (req, res, next) => {
  const newPet = req.body;
  if (!newPet || !newPet.name || !newPet.kind || !newPet.age) {
    res.status(400).send("Invalid pet data");
    return;
  }
  try {
    const pets = await sql`INSERT INTO petsTable (name, kind, age)
    VALUES (${newPet.name}, ${newPet.kind}, ${newPet.age})`;
    res.setHeader("Content-Type", "application/json");
    res.status(201).send(pets[0]);
  } catch (err) {
    next(err);
  }
};

export const getPet = async (req, res, next) => {
  const index = Number(req.params.id);
  console.log(index);

  if (isNaN(index)) {
    res.status(400).send("Invalid index");
    return;
  }
  try {
    const pets = await sql`SELECT * FROM petsTable WHERE id =${index}`;
    if (pets.length === 0 || pets.length === undefined) {
      res.status(404).send("Not found");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.send(pets[0]);
  } catch (err) {
    next(err);
  }
};

export const deletePet = async (req, res, next) => {
  const index = Number(req.params.id);
  console.log(index);

  if (isNaN(index)) {
    res.status(400).send("Invalid index");
    return;
  }
  try {
    const pets = await sql`DELETE FROM petsTable WHERE id =${index}`;
    if (pets.length === 0) {
      res.status(404).send("Not found");
    }
    res.setHeader("Content-Type", "application/json");
    res.send(pets[0]);
  } catch (err) {
    next(err);
  }
};

export const updatePet = async (req, res, next) => {
  const index = Number(req.params.id);
  const updatedPet = req.body;

  if (isNaN(index)) {
    res.status(400).send("invalid pet data");
    return;
  }
  try {
    const pets = await sql`SELECT * FROM petsTable WHERE id =${index}`;
    if (pets.length === 0) {
      res.status(404).send("Not found");
    }
    if (!pets[0]) {
      res.status(404).send("Not found");
      return;
    }
    const mergedPet = Object.assign({}, pets[0], updatedPet);
    await sql`UPDATE petsTable SET name = ${mergedPet.name}, kind = ${mergedPet.kind}, age = ${mergedPet.age} WHERE id =${index}`;
    res.setHeader("Content-Type", "application/json");
    res.send(mergedPet);
  } catch (err) {
    next(err);
  }
};
