import express from "express";
import router from "./petRoutes.js";

const app = express();

app.use(express.json());
app.use("/pets", router);

export default app;
