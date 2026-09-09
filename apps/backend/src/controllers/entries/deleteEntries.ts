import { Request, Response } from "express"
import { prisma } from "../../db/index";

export const deleteEntries = async (req: Request, res: Response) => {
    res.send("I am delete")
}
