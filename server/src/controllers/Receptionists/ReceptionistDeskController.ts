import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import AsyncError from "../../Errors/asyncError";
import HttpError from "../../Errors/httpError";
import {z} from 'zod'


const client = new PrismaClient();

const patientSchema=  z.object({
    first_name :z.string(),
    last_name:z.string(),
    age:z.int(),
    gender:z.string(),
    contact_number:z.string(),
    adress:z.string()
    
})

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
    const parseError=patientSchema.safeParse(req.body)
    if(!parseError.success){
        return next(new HttpError(400,JSON.stringify(z.prettifyError(parseError.error))))
    }
    const data = req.body
    console.log(data)
    const createdPatient = await client.patient.create({data:data})
    if(!createdPatient){
        next (new HttpError(400,'couldnot create patient'))
    }
    console.log(data)
    return res.status(200).json({
        status:'success',
        statusCode:200,
        createdPatient
        
    })
    
})
