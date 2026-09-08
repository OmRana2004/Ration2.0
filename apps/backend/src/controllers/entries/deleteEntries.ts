import { Request, Response } from "express"
import { prisma } from "@repo/db/client";

export const deleteEntries = async (req: Request, res: Response) => {
    res.send("I am delete")
}
