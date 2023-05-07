import express from "express";
import router from "./petRoutes.js";
import bcrypt from "bcrypt";
import pg from "pg";

const app = express();
const pool = new pg.Pool({
  user: "jovi",
  host: "localhost",
  database: "pets",
  password: "123",
  port: 5432,
});

app.use(express.json());

app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const passwordHash = bcrypt.hashSync(password, salt);

  try {
    // Insert the user into the database
    await pool.query(
      `INSERT INTO userTable (username, password) VALUES ($1, $2)`,
      [username, passwordHash]
    );

    res.status(201).send("User created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Authentication required");
  }
  const credentials = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const username = credentials[0];
  const password = credentials[1];

  try {
    const user = await pool.query(`SELECT * FROM userTable WHERE username=$1`, [
      username,
    ]);
    if (!user || !(await bcrypt.compare(password, user.rows[0].password))) {
      return res.status(401).send("Invalid username or password");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).send("Invalid username or password");
  }
};
app.use("/pets", auth, router);

export default app;
