import { Request, Response } from "express"
import { prisma } from "../../db/index";

export const addEntrie = async (
    req: Request,
    res: Response
) => {
    try {
        const { name, unit, cardType } = req.body

        if (!name || unit === undefined || !cardType) {
            return res.status(400).json({
                success: false,
                msg: "All fildes are required"
            });
        }

        const entry = await prisma.entry.create({
            data: {
                name: String(name),
                unit: Number(unit),
                cardType,
            },
        });

        return res.status(201).json({
            success: true,
            msg: "Entry created successfully",
            data: entry
        });
    } catch (error) {
        console.log("ADD ENRTY ERROR:", error);

        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};
