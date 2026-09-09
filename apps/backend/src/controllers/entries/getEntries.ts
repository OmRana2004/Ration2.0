import { Request, Response } from "express"
import { prisma } from "../../db/index";

export const getEntries = async (req: Request, res: Response) => {
    res.send("I am get")
}
