import express from "express";

const router = express.Router();

import {
  getAllPets,
  addPet,
  getPet,
  deletePet,
  updatePet,
} from "./petController.js";

router.get("/", getAllPets).post("/", addPet);
router.get("/:id", getPet).delete("/:id", deletePet).patch("/:id", updatePet);

export default router;
