import express from "express";
import fs from "fs";

const app = express();
const port = 4000;

app.use(express.json());
app.use((err, req, res, next) => {
  res.status(500).send("Internal servor error");
});

app.get("/pets", (req, res, next) => {
  fs.readFile("pets.json", "utf-8", (err, str) => {
    if (err) {
      next(err);
    }

    const pets = JSON.parse(str);

    res.setHeader("Content-Type", "application/json");
    res.send(pets);
  });
});

app.get("/pets/:index", (req, res, next) => {
  const index = parseInt(req.params.index);

  if (isNaN(index)) {
    res.status(400).send("Invalid index");
    return;
  }

  fs.readFile("pets.json", "utf-8", (err, str) => {
    if (err) {
      next(err);
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

app.post("/pets", (req, res, next) => {
  const newPet = req.body;
  if (!newPet || !newPet.name || !newPet.kind || !newPet.age) {
    res.status(400).send("Invalid pet data");
    return;
  }
  fs.readFile("pets.json", "utf-8", (err, str) => {
    if (err) {
      next(err);
      return;
    }

    const pets = JSON.parse(str);

    pets.push(newPet);

    fs.writeFile("pets.json", JSON.stringify(pets), (err) => {
      if (err) {
        next(err);
        return;
      }

      res.setHeader("Content-Type", "application/json");
      res.send(newPet);
    });
  });
});

app.delete("/pets/:index", (req, res, next) => {
  const index = parseInt(req.params.index);

  if (isNaN(index)) {
    res.status(400).send("Invalid index");
  }

  fs.readFile("pets.json", "utf-8", (err, str) => {
    if (err) {
      next(err);
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

app.put("/pets/:index", (req, res, next) => {
  const index = parseInt(req.params.index);

  if (isNaN(index)) {
    res.status(400).send("Invalid index");
    return;
  }
  const updatedPet = req.body;
  if (!updatedPet || !updatedPet.name || !updatedPet.kind || !updatedPet.age) {
    res.status(400).send("Invalid pet data");
    return;
  }
  fs.readFile("pets.json", "utf-8", (err, str) => {
    if (err) {
      next(err);
      return;
    }

    const pets = JSON.parse(str);

    if (index < 0 || index >= pets.length) {
      res.status(404).send("Not Found");
      return;
    }

    pets[index] = updatedPet;

    fs.writeFile("pets.json", JSON.stringify(pets), (err) => {
      if (err) {
        next(err);
        return;
      }

      res.setHeader("Content-Type", "application/json");
      res.send(updatedPet);
      console.log("Success!");
    });
  });
});

app.patch("/pets/:index", (req, res, next) => {
  const index = parseInt(req.params.index);

  if (isNaN(index)) {
    res.status(400).send("Invalid index");
    return;
  }
  const updatedPet = req.body;
  if (!updatedPet) {
    res.status(400).send("Invalid pet data");
    return;
  }
  fs.readFile("pets.json", "utf-8", (err, str) => {
    if (err) {
      next(err);
      return;
    }

    const pets = JSON.parse(str);

    if (index < 0 || index >= pets.length) {
      res.status(404).send("Not Found");
      return;
    }

    const pet = pets[index];
    const mergedPet = Object.assign({}, pet, updatedPet);

    pets[index] = mergedPet;

    fs.writeFile("pets.json", JSON.stringify(pets), (err) => {
      if (err) {
        next(err);
        return;
      }

      res.setHeader("Content-Type", "application/json");
      res.send(updatedPet);
      console.log("Success!");
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
