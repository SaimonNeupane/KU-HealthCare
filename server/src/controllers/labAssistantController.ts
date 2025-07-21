import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const labReport: any = async (req: Request, res: Response) => {
  const labData = await prisma.labTest.findMany({
    select: {
      patientId: true,
      status: true,
      patient: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  });
  return res.status(200).json(labData);
};
