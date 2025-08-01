import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const labReport: any = async (req: Request, res: Response) => {
  const labData = await prisma.labTest.findMany({
    select: {
      test_id: true,
      patientId: true,
      requesting_doctor_id: true,
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

export const labStatus: any = async (req: Request, res: Response) => {
  const id = req.params.id;

  const labStatus = await prisma.labTest.update({
    where: {
      test_id: id,
    },
    data: {
      status: "completed",
    },
    select: {
      status: true,
    },
  });

  return res.status(200).json(labStatus);
};
