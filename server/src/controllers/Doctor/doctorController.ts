import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import AsyncError from "../../Errors/asyncError";
import HttpError from "../../Errors/httpError";
import { waitForDebugger } from "inspector";

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

export const labRequest = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const Appointment: LabRequestBody = req.body;
    if (
      !Appointment.appointment_id ||
      !Appointment.patientId ||
      !Appointment.doctorId
    ) {
      return next(new HttpError(400, "Missing required fields"));
    }

    const labReq = await prisma.labTest.create({
      data: {
        appointmentId: Appointment.appointment_id,
        patientId: Appointment.patientId,
        requesting_doctor_id: Appointment.doctorId,
        status: "Pending",
      },
    });

    if (!labReq) {
      return next(new HttpError(400, `Lab test creation Failed`));
    }

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
    let updatedLabReport = null;
    let updatedBed = null;

    const patient = await prisma.patient.findFirst({
      where: {
        patient_id: req.params.id,
      },
    });
    let updatedPatient = patient;
    const labReport = await prisma.labTest.findFirst({
      where: {
        patientId: req.params.id,
      },
    });
    if (!!labReport) {
      updatedLabReport = await prisma.labTest.update({
        where: {
          test_id: labReport?.test_id,
        },
        data: {
          status: "Arrived",
        },
      });
    }
    const appointment = await prisma.appointment.findFirst({
      where: {
        patientId: req.params.id,
      },
    });
    let updatedAppointment = appointment;
    if (!!appointment) {
      updatedAppointment = await prisma.appointment.update({
        where: {
          appointment_id: appointment?.appointment_id,
        },
        data: {
          status: "Completed",
        },
      });
    }
    const isAvailable: any = patient?.bedId;
    if (!!isAvailable) {
      updatedBed = await prisma.bed.update({
        where: { bed_id: isAvailable },
        data: {
          status: "available",
        },
      });
      updatedPatient = await prisma.patient.update({
        where: {
          patient_id: req.params.id,
        },
        data: {
          bedId: null,
        },
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Successfully diagnosed the patient",
      updatedBed,
      updatedLabReport,
      updatedPatient,
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
