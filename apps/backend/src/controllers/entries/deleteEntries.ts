import { Request, Response } from "express";
import { prisma } from "../../db/index";

export const deleteEntries = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string | undefined;

    // DELETE ONE ENTRY
    if (id) {
      await prisma.entry.delete({
        where: {
          id,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Entry deleted successfully",
      });
    }

    // DELETE ALL ENTRIES
    const result = await prisma.entry.deleteMany();

    return res.status(200).json({
      success: true,
      msg: "ALL ENTRIES DELETED SUCCESSFULLY",
      deletedCount: result.count,
    });

  } catch (error) {
    console.log("DELETE ENTRY ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};