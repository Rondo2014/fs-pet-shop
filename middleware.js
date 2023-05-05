import express from "express";
import router from "./petRoutes.js";
import bcrypt from "bcrypt";
import { sql } from "./petController.js";

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const passwordHash = bcrypt.hashSync(password, salt);

  try {
    // Insert the user into the database
    await sql`INSERT INTO userTable (username, password) VALUES (${username}, ${passwordHash})`;

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
    const user = await sql`SELECT * FROM userTable WHERE username=${username}`;
    if (!user || !(await bcrypt.compare(password, user[0].password))) {
      return res.status(401).send("Invalid username or password");
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send("Invalid username or password");
  }
};
app.use("/pets", auth, router);

export default app;
