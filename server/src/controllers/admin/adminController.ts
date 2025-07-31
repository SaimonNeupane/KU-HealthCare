import { Request, Response, NextFunction } from "express";
import AsyncError from "../../Errors/asyncError";
import HttpError from "../../Errors/httpError";
import { PrismaClient } from "@prisma/client";
import tr from "zod/v4/locales/tr.cjs";
import { assert } from "console";
import { treeifyError } from "zod";

const prisma = new PrismaClient();

export const doctorData = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await prisma.user.findMany({
      where: {
        role: "doctor",
      },
      select: {
        email: true,
        doctor: {
          select: {
            doctor_id: true,
            first_name: true,
            last_name: true,
            department: true,
            departmentId: true,
            specialization: true,
            phone: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      doctors: data,
    });
  }
);

export const dashboard = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const [patientCount, labCount, doctorCount, appointmentCount, bedCount] =
      await Promise.all([
        prisma.patient.count(),
        prisma.labTest.count(),
        prisma.doctor.count(),
        prisma.appointment.count(),
        prisma.bed.count(),
      ]);

    return res.status(200).json({
      status: "success",
      patientCount,
      doctorCount,
      labCount,
      appointmentCount,
      bedCount,
    });
  }
);

export const appointments = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const appointments = await prisma.appointment.findMany({
      select: {
        appointment_id: true,
        patient: {
          select: {
            first_name: true,
            last_name: true,
            patient_id: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
        doctor: {
          select: {
            first_name: true,
            last_name: true,
            doctor_id: true,
            room: {
              select: {
                room_number: true,
              },
            },
          },
        },
        created_at: true,
      },
    });

    return res.status(200).json({
      status: "success",
      appointments,
    });
  }
);

export const patients = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const patients = await prisma.patient.findMany({
      select: {
        patient_id: true,
        first_name: true,
        last_name: true,
        contact_number: true,
        LabTest: {
          select: {
            status: true,
          },
        },
        Appointment: {
          select: {
            status: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      patients,
    });
  }
);

export const receptionists = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const receptionist = await prisma.user.findMany({
      where: {
        role: "receptionist",
      },
      select: {
        email: true,

        receptionist: {
          select: {
            first_name: true,
            last_name: true,
            phone: true,
          },
        },
      },
    });
    return res.status(200).json({
      status: "success",
      receptionists: receptionist,
    });
  }
);

export const createDoctor = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      first_name,
      last_name,
      email,
      username,
      password,
      role,
      specialization,
      department_name,
      workingFrom,
      workingTo,
      phone,
      room_number,
    } = req.body;

    const department = await prisma.department.findFirst({
      where: { name: department_name },
    });

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
        role,
      },
    });

    const room = await prisma.room.create({
      data: {
        room_number: Number(room_number),
        status: "available",
        departmentId: department.department_id,
      },
    });

    const doctor = await prisma.doctor.create({
      data: {
        first_name,
        last_name,
        specialization,
        is_online: false,
        departmentId: department.department_id,
        roomId: room.room_id,
        workingFrom,
        workingTo,
        phone,
        userId: user.user_id,
      },
    });

    res.status(201).json({
      message: "Doctor and Room created successfully",
      doctor,
    });
  }
);

export const updateDoctor = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      specialization,
      departmentId,
      roomId,
      workingFrom,
      workingTo,
      phone,
      password,
    } = req.body;

    const updatedDoctor = await prisma.doctor.update({
      where: { doctor_id: id },
      data: {
        first_name,
        last_name,
        specialization,
        departmentId,
        roomId,
        workingFrom,
        workingTo,
        phone,
      },
    });

    if (password) {
      await prisma.user.update({
        where: { user_id: updatedDoctor.userId },
        data: { password },
      });
    }

    res.json({ message: "Doctor updated successfully", doctor: updatedDoctor });
  }
);

export const deleteDoctor = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const doctor = await prisma.doctor.findUnique({
        where: { doctor_id: id },
      });

      if (!doctor) return res.status(404).json({ error: "Doctor not found" });

      await prisma.doctor.delete({ where: { doctor_id: id } });
      await prisma.user.delete({ where: { user_id: doctor.userId } });

      res.json({ message: "Doctor deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete doctor" });
    }
  }
);

export const createReceptionist = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, last_name, phone, username, email, password } =
      req.body;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
        role: "receptionist",
      },
    });

    const receptionist = await prisma.receptionist.create({
      data: {
        first_name,
        last_name,
        phone,
        userId: user.user_id,
      },
    });

    res.status(201).json({ receptionist });
  }
);

export const updateReceptionist = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { first_name, last_name, phone, username, email, password } =
      req.body;

    const receptionist = await prisma.receptionist.update({
      where: { receptionist_id: id },
      data: {
        first_name,
        last_name,
        phone,
      },
    });

    await prisma.user.update({
      where: { user_id: receptionist.userId },
      data: {
        username,
        email,
        ...(password && { password }),
      },
    });

    res.status(200).json({ message: "Receptionist updated successfully." });
  }
);

export const deleteReceptionist = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const receptionist = await prisma.receptionist.findUnique({
      where: { receptionist_id: id },
    });

    if (!receptionist) {
      return res.status(404).json({ error: "Receptionist not found" });
    }

    await prisma.receptionist.delete({
      where: { receptionist_id: id },
    });

    await prisma.user.delete({
      where: { user_id: receptionist.userId },
    });

    res
      .status(200)
      .json({ message: "Receptionist and user deleted successfully" });
  }
);
