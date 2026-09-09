import { Request, Response } from "express";
import { prisma } from "../../db/index";

export const updateEntrie = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const { name, unit, cardType } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Entry ID is required",
      });
    }

    if (!name || unit === undefined || !cardType) {
      return res.status(400).json({
        success: false,
        message: "Name, unit and cardType are required",
      });
    }

    // Check if entry exists
    const existingEntry = await prisma.entry.findUnique({
      where: {
        id,
      },
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    // Update entry
    const entry = await prisma.entry.update({
      where: {
        id,
      },
      data: {
        name: String(name),
        unit: Number(unit),
        cardType,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Entry updated successfully",
      data: entry,
    });

  } catch (error) {
    console.error("UPDATE ENTRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};