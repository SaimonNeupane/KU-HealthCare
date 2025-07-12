import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import AsyncError from "../../Errors/asyncError";
import HttpError from "../../Errors/httpError";

const client = new PrismaClient();

export const DoctorDetails = AsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctors = await client.user.findMany({
      where: {
        role: 'doctor',
        doctor:{
            isNot:null
        }
      },
     select:{
        email:true,
        doctor:{
            select:{
                first_name:true,
                last_name:true,
                workingFrom:true,
                workingTo:true,
                department:{
                    select:{
                        name:true
                    }
                },
                is_online:true,
                doctor_id:true

            }
        }
     }
    });
    if (doctors.length==0) {
      next(new HttpError(404, "no doctors found"));
    }
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      doctors,
    });
  }
);

export const PatientDetials=AsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const patients=await client.patient.findMany({
        select:{
            first_name:true,
            last_name:true,
            Appointment:{
                select:{
                    status:true,
                    LabTest:{
                        select:{
                            status:true
                        }
                    }
                }
            },
            bed:{
                select:{
                    bed_number:true
                }
            }
            


        }
    })
    if(patients.length==0){
        next(new HttpError(404,'no patients found'))
    }
    return res.status(200).json({
        status:'success',
        statusCode:200,
        patients
    })
})

export const RegisterPatient=AsyncError((req:Request,res:Response,next:NextFunction)=>{
    const body = req.body
})
