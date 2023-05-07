import express from "express";
import pg from "pg";

const pool = new pg.Pool({
  user: "jovi",
  host: "localhost",
  database: "pets",
  password: "123",
  port: 5432,
});

const app = express();
app.use(express.json());

// error handler
app.use((err, req, res, next) => {
  res.status(500).send("Internal servor error");
});

// pet routes for router middleware
export const getAllPets = async (req, res, next) => {
  try {
    const pets = await pool.query(`SELECT * FROM petsTable;`);
    res
      .setHeader("Content-Type", "application/json")
      .status(200)
      .send(pets.rows);
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
    const pets = await pool.query(
      `INSERT INTO petsTable (name, kind, age)
    VALUES ($1, $2, $3) RETURNING *`,
      [newPet.name, newPet.kind, newPet.age]
    );
    res
      .setHeader("Content-Type", "application/json")
      .status(201)
      .send(pets.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getPet = async (req, res, next) => {
  const index = Number(req.params.id);

  if (isNaN(index)) {
    res.status(400).send("Invalid index");
    return;
  }
  try {
    const pets = await pool.query(`SELECT * FROM petsTable WHERE id =$1`, [
      index,
    ]);
    if (pets.rows.length === 0 || pets.rows.length === undefined) {
      res.status(404).send("Not found");
      return;
    }
    res.setHeader("Content-Type", "application/json").send(pets.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deletePet = async (req, res, next) => {
  const index = Number(req.params.id);

  if (isNaN(index)) {
    res.status(400).send("Invalid index");
    return;
  }
  try {
    const pets = await pool.query(`DELETE FROM petsTable WHERE id =$1`, [
      index,
    ]);
    if (pets.rows.length === 0) {
      res.status(404).send("Not found");
    }
    res
      .setHeader("Content-Type", "application/json")
      .send(pets.rows[0], "pet deleted");
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
  const keys = ["name", "age", "kind"];
  const hasKeys = Object.keys(updatedPet).some((key) => {
    return keys.includes(key);
  });
  if (!hasKeys) {
    res.status(400).send("invalid pet data");
    return;
  }
  try {
    const pets = await pool.query(`SELECT * FROM petsTable WHERE id =$1`, [
      index,
    ]);
    if (pets.rows.length === 0) {
      res.status(404).send("Not found");
    }
    if (!pets.rows[0]) {
      res.status(404).send("Not found");
      return;
    }
    const mergedPet = Object.assign({}, pets.rows[0], updatedPet);
    await pool.query(
      `UPDATE petsTable SET name =$1, kind =$2, age =$3 WHERE id =$4`,
      [mergedPet.name, mergedPet.kind, mergedPet.age, index]
    );
    res.setHeader("Content-Type", "application/json").send(mergedPet);
  } catch (err) {
    next(err);
  }
};
