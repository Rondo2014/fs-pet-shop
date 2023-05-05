import express from "express";
import router from "./petRoutes.js";

const app = express();

const users = {
  jovi: "123",
  user2: "password2",
  user3: "password3",
};
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send("Authentication required");
    return;
  }
  const credentials = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  console.log(authHeader);
  console.log(credentials);
  const username = credentials[0];
  console.log(username);
  const password = credentials[1];
  console.log(password);
  if (!users[username] || users[username] !== password) {
    res.status(401).send("Invalid username or password");
    return;
  }
  next();
};
app.use(express.json());
app.use("/pets", auth, router);

export default app;
