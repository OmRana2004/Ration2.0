import { Request, Response } from "express"
import { prisma } from "../../db/index";

export const updateEntrie = async (req: Request, res: Response) => {
    res.send("I am update")
}
