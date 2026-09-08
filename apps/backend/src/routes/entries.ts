import { Router } from "express";

import { addEntrie } from "../controllers/entries/addEntrie";
import { getEntries } from "../controllers/entries/getEntries";
import { updateEntrie } from "../controllers/entries/updateEntrie";
import { deleteEntries } from "../controllers/entries/deleteEntries";

const router = Router();

router.post(
  "/entrie",
  addEntrie
);
router.get(
  "/entries",
  getEntries
);
router.put(
  "/entrie/id",
  updateEntrie
);
router.delete(
  "/entries/id",
  deleteEntries
);

export default router;