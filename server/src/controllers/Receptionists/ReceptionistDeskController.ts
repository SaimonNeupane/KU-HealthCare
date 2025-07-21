import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import AsyncError from "../../Errors/asyncError";
import HttpError from "../../Errors/httpError";
import { CLIENT_RENEG_LIMIT } from "tls";
import { stat } from "fs";

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

export const RegisterPatient=AsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    const data = req.body
    console.log(data)
    const createPatient = await client.patient.create({data})
    if(!createPatient){
        next (new HttpError(400,'couldnot create patient'))
    }
    console.log(data)
    return res.status(200).json({
        status:'success',
        statusCode:200,
        createPatient
        
    })
    
})
