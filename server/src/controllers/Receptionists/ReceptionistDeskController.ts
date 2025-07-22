import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import AsyncError from "../../Errors/asyncError";
import HttpError from "../../Errors/httpError";
import { z } from "zod";
import tr from "zod/v4/locales/tr.cjs";
import { time } from "console";
import be from "zod/v4/locales/be.cjs";
import { connect } from "http2";

const client = new PrismaClient();

const patientSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  age: z.int(),
  gender: z.string(),
  contact_number: z.string(),
  address: z.string(),
});

export const DoctorDetails = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctors = await client.user.findMany({
      where: {
        role: "doctor",
        doctor: {
          isNot: null,
        },
      },
      select: {
        email: true,
        doctor: {
          select: {
            first_name: true,
            last_name: true,
            workingFrom: true,
            workingTo: true,
            department: {
              select: {
                name: true,
                department_id: true,
              },
            },
            is_online: true,
            doctor_id: true,
          },
        },
      },
    });
    if (doctors.length == 0) {
      next(new HttpError(404, "no doctors found"));
    }
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      doctors,
    });
  }
);

export const PatientDetials = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const patients = await client.patient.findMany({
      select: {
        first_name: true,
        last_name: true,
        Appointment: {
          select: {
            status: true,
            LabTest: {
              select: {
                status: true,
              },
            },
          },
        },
        bed: {
          select: {
            bed_number: true,
          },
        },
      },
    });
    if (patients.length == 0) {
      next(new HttpError(404, "no patients found"));
    }
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      patients,
    });
  }
);

export const showDoctors = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const department_Id = req.params.dep_id;
    if (!department_Id) {
      return next(new HttpError(400, "Department Id is required"));
    }
    console.log(department_Id);
    const AvailableDoctor = await client.doctor.findMany({
      where: {
        departmentId: department_Id,
        is_online: true,
      },
      select: {
        doctor_id: true,
        departmentId: true,
        department: true,
        first_name: true,
        last_name: true,
        specialization: true,
        roomId: true,
      },
    });
    if (!AvailableDoctor || AvailableDoctor.length == 0) {
      return res.status(404).json({
        message: `No doctors avaiable in the department id:${department_Id}`,
      });
    }
    return res.status(200).json({
      status: "success",
      AvailableDoctor,
    });
  }
);
export const RegisterPatient = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const parseError = patientSchema.safeParse(req.body.patientDetails);
    const { is_emergency, doctorId, departmentId, roomId } = req.body;
    const doctor = await client.doctor.findFirst({
      where: {
        doctor_id: doctorId,
      },
    });
    if (!doctor?.is_online) {
      return next(new HttpError(400, "selected doctor is not online "));
    }
    console.log("the doctor is online");
    console.log(req.body);
    if (!parseError.success) {
      return next(
        new HttpError(400, JSON.stringify(z.prettifyError(parseError.error)))
      );
    }
    console.log("data is now validated");
    let availableBed = null;
    if (is_emergency) {
      availableBed = await client.bed.findFirst({
        where: {
          status: "available",
        },
      });
      await client.bed.update({
        where: { bed_id: availableBed?.bed_id },
        data: {
          status: "reserved",
        },
      });
    }
    console.log(`the bed for the patient is`, availableBed);

    const createdPatient = await client.patient.create({
      data: {
        ...req.body.patientDetails,
        bed: availableBed ? { connect: { bed_id: availableBed.bed_id } } : null,
      },
    });

    if (!createdPatient) {
      next(new HttpError(400, "couldnot create patient"));
    }

    const appointment = await client.appointment.create({
      data: {
        patientId: createdPatient.patient_id,
        doctorId,
        departmentId,
        is_emergency,
        status: "inQueue",
        roomId,
      },
    });
    if (!appointment) {
      return next(new HttpError(500, "Something went wrong"));
    }
    return res.status(200).json({
      status: "success",
      appointment,
    });
  }
);
