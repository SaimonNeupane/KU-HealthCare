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
            doctor_id:true,
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
    const [patientCount, labCount, doctorCount, appointmentCount, bedCount] = await Promise.all([
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

export const appointments= AsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  const appointments= await prisma.appointment.findMany({
    select:{
      appointment_id:true,
      patient:{
        select:{
          first_name:true,
          last_name:true,
          patient_id:true,
        }
      },
      department:{
        select:{
            name:true
        }
      },
      doctor:{
        select:{
            first_name:true,
            last_name:true,
            doctor_id:true,
            room:{
              select:{
                room_number:true
              }
            }
        }
      },created_at:true
    }
  })

 return res.status(200).json({
      status: "success",  
      appointments,
    });
})

export const patients=AsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  const patients= await prisma.patient.findMany({
    select:{
        patient_id:true,
        first_name:true,
        last_name:true,
        contact_number:true,
        LabTest:{
          select:{
            status:true
          }
        },
        Appointment:{
            select:{
              status:true
            }
        }
    }
  })


  return res.status(200).json({
     status:"success",
    patients
  })
   
  
})


export const receptionists=AsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  const receptionist=await prisma.user.findMany({
    where:{
      role:"receptionist"
    },
    select:{
      email:true,
      
      receptionist:{
        select:{
          first_name:true,
          last_name:true,
          phone:true
        }
      }
    
    }
  })
  return res.status(200) .json({
    status: "success",
    receptionists: receptionist,
  });
})