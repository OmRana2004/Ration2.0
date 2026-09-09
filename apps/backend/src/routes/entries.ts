import { Router } from "express";

import { addEntrie } from "../controllers/entries/addEntrie";
import { getEntries } from "../controllers/entries/getEntries";
import { updateEntrie } from "../controllers/entries/updateEntrie";
import { deleteEntries } from "../controllers/entries/deleteEntries";

const router = Router();

// GET /api/v1/entries
router.get("/", getEntries);

// POST /api/v1/entries
router.post("/", addEntrie);

// PUT /api/v1/entries/:id
router.put("/:id", updateEntrie);

// DELETE /api/v1/entries/:id
router.delete("/:id", deleteEntries);

export default router;