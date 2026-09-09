import { Request, Response } from "express"
import { prisma } from "../../db/index";

export const getEntries = async (
    req: Request,
    res: Response
) => {
    try {
        const entries = await prisma.entry.findMany({
            orderBy:{
                createdAt: "desc"
            },
        });
         
        return res.status(200).json({
            susuccess: true,
            data: entries,
        });
    } catch(error) {
        console.log("GET ENTRITS ERROR:", error);

        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
};