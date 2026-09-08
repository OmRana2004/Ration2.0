import { Router  } from "express";

import entriesRoutes  from  "./entries";

const router = Router();

router.use("/entries", entriesRoutes)

export default router;