import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import AsyncError from "../../Errors/asyncError";
import HttpError from "../../Errors/httpError";

const prisma = new PrismaClient();

interface LabRequestBody {
  appointment_id: string;
  patientId: string;
  doctorId: string;
}



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

export const labRequest = AsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const Appointment: LabRequestBody = req.body;

  const labReq = await prisma.labTest.create({
    data: {
      appointmentId: Appointment.appointment_id,
      patientId: Appointment.patientId,
      requesting_doctor_id: Appointment.doctorId,
      status: 'Pending',
      
    }
  });
  
  if (!labReq) {
    return next(new HttpError(400, `Lab test creation Failed`));
  }
  
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    labReq
  });
});

