import { Request, Response } from "express"
import { prisma } from "@repo/db/client";

export const getEntries = async (req: Request, res: Response) => {
    res.send("I am get")
}
