import { Request, Response } from "express"
import { prisma } from "../../db/index";

export const deleteEntries = async (
    req: Request,
    res: Response
) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return res.status(400).json({
                success: false,
                msg: "ENTRY ID IS REQUIRED"
            });
        }

        await prisma.entry.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            success: true,
            msg: "Entry deleted successfully",
        });
    } catch (error) {
        console.log("DELETE ENTRY ERROR:",error);

        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
        });
    }
};
