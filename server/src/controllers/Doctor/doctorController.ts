import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const PatientDetails: any = async (req: Request, res: Response) => {
  const details = await prisma.patient.findMany({
    select: {
      LabTest: {
        select: {
          status: true,
        },
      },
      bed: {
        select: {
          bed_number: true,
        },
      },
      patient_id: true,
      age: true,
      gender: true,
      first_name: true,
      last_name: true,
      Appointment: {
        select: {
          appointment_time: true,
          room: {
            select: {
              room_number: true,
            },
          },
        },
      },
    },
  });
  return res.status(200).json(details);
};
