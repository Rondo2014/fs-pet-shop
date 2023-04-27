import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

app.get("/pets", (req, res) => {
  fs.readFile("pets.json", "utf-8", (err, str) => {
    if (err) {
      res.status(500).end();
      return;
    }

    const pets = JSON.parse(str);

    res.setHeader("Content-Type", "application/json");
    res.send(pets);
  });
});

app.get("/pets/:index", (req, res) => {
  const index = parseInt(req.params.index);

  if (isNaN(index)) {
    res.status(400).send("Invalid index");
    return;
  }

  fs.readFile("pets.json", "utf-8", (err, str) => {
    if (err) {
      res.status(500).end();
      return;
    }

    const pets = JSON.parse(str);

    if (index < 0 || index >= pets.length) {
      res.status(404).send("Not Found");
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.send(pets[index]);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
