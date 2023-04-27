import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.json());

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

app.post("/pets", (req, res) => {
  const newPet = req.body;
  if (!newPet || !newPet.name || !newPet.kind || !newPet.age) {
    res.status(400).send("Invalid pet data");
    return;
  }
  fs.readFile("pets.json", "utf-8", (err, str) => {
    if (err) {
      res.status(500).end();
      return;
    }

    const pets = JSON.parse(str);

    pets.push(newPet);

    fs.writeFile("pets.json", JSON.stringify(pets), (err) => {
      if (err) {
        res.status(500).end();
        return;
      }

      res.setHeader("Content-Type", "application/json");
      res.send(newPet);
    });
  });
});

app.delete("/pets/:index", (req, res) => {
  const index = parseInt(req.params.index);

  if (isNaN(index)) {
    res.status(400).send("Invalid index");
  }

  fs.readFile("pets.json", "utf-8", (err, str) => {
    if (err) {
      res.status(500).end();
    }
    const pets = JSON.parse(str);

    if (index < 0 || index >= pets.length) {
      res.status(404).send("Not Found");
      return;
    }

    pets.splice(index, 1);

    fs.writeFile("pets.json", JSON.stringify(pets), (err) => {
      if (err) {
        res.status(500).next();
        return;
      }

      res.status(204).end();
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
