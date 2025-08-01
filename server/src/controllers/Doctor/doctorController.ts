import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import AsyncError from "../../Errors/asyncError";
import HttpError from "../../Errors/httpError";
import { customRequest } from "../../middleware/authenticateToken";

const prisma = new PrismaClient();

export const PatientDetails: any = async (
  req: customRequest,
  res: Response
) => {
  const userId = req.user?.userId; // This is the logged-in user's ID
  const userRole = req.user?.role; // This is the logged-in user's role

  console.log("Logged-in User ID:", userId);
  const user = await prisma.doctor.findFirst({
    where: {
      userId: userId,
    },
  });

  const details = await prisma.patient.findMany({
    where: {
      Appointment: {
        some: {
          doctorId: user?.doctor_id,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
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

export const labRequest = AsyncError(
  async (req: customRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const doctor = await prisma.doctor.findFirst({
      where: { userId },
    });

    if (!doctor) {
      return next(new HttpError(404, "Doctor not found"));
    }

    const { appointment_id, patientId } = req.body;

    // Validate that appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { appointment_id },
    });

    if (!appointment) {
      return next(new HttpError(404, "Appointment not found"));
    }

    // Validate that patient exists
    const patient = await prisma.patient.findUnique({
      where: { patient_id: patientId },
    });

    if (!patient) {
      return next(new HttpError(404, "Patient not found"));
    }

    const labReq = await prisma.labTest.create({
      data: {
        appointmentId: appointment_id,
        patientId,
        requesting_doctor_id: doctor.doctor_id,
        status: "pending",
      },
    });

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      labReq,
    });
  }
);

export const bedQuery = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const patient = await prisma.patient.findFirst({
      where: {
        patient_id: req.params.id,
      },
    });
    const isAvailable: any = patient?.bedId;
    if (!!isAvailable) {
      const updatedBed = await prisma.bed.update({
        where: { bed_id: isAvailable },
        data: {
          status: "available",
        },
      });
      const updatedPatient = await prisma.patient.update({
        where: {
          patient_id: req.params.id,
        },
        data: {
          bedId: null,
        },
      });
      return res.status(200).json({
        status: "success",
        updatedBed,
      });
    }
    const availableBed = await prisma.bed.findFirst({
      where: {
        status: "available",
      },
    });
    if (!availableBed) {
      return res.status(404).json({
        status: "Fail",
        message: "All beds are reserved",
      });
    }
    const data = await prisma.bed.update({
      where: { bed_id: availableBed?.bed_id },
      data: {
        status: "reserved",
      },
    });
    const refinedPatient = await prisma.patient.update({
      where: {
        patient_id: req.params.id,
      },
      data: {
        bedId: availableBed?.bed_id,
      },
    });
    return res.status(200).json({
      status: "Success",
      data,
    });
  }
);
export const completeDiagnosis = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const patientId = req.params.id;

    const appointment = await prisma.appointment.findFirst({
      where: {
        patientId: patientId,
        status: {
          not: "completed",
        },
      },
      orderBy: {
        appointment_time: "desc",
      },
    });

    if (!appointment) {
      return res.status(404).json({
        status: "error",
        message: "No active appointment found for this patient",
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        appointment_id: appointment.appointment_id,
      },
      data: {
        status: "completed",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Successfully completed diagnosis",
      data: updatedAppointment,
    });
  }
);
export const changeOnlineStatus = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctor = await prisma.doctor.findFirst({
      where: {
        doctor_id: req.params.id,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: `No doctor of ${req.params.id} exists`,
      });
    }

    const finalStatus = await prisma.doctor.update({
      where: {
        doctor_id: req.params.id,
      },
      data: {
        is_online: !doctor.is_online,
      },
    });
    return res.status(200).json({
      status: "Success",
      finalStatus,
    });
  }
);

export const patientInQueue = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const OnePatientForDiagnosis: any = async (
  req: Request,
  res: Response
) => {
  const patId = req.params.id;
  const details = await prisma.appointment.findFirst({
    where: {
      patientId: patId,
    },
    select: {
      appointment_id: true,
      patient: {
        select: {
          first_name: true,
          last_name: true,
          age: true,
          gender: true,
          patient_id: true,
          contact_number: true,
          address: true,
          bed: {
            select: {
              bed_id: true,
              bed_number: true,
            },
          },
          LabTest: true,
        },
      },
      status: true,
    },
  });
  return res.status(200).json(details);
};
