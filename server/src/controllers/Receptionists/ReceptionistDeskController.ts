import { Request,Response,NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import AsyncError from "../../Errors/asyncError";
import HttpError from "../../Errors/httpError";


const client= new PrismaClient();

export const DoctorDetails=AsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const doctors=await client.doctor.findMany({
        select:{
            
        }
    })
    if(!doctors){
        next(new HttpError(404,'no doctors found'))
    }
    return res.status(200).json({
        status:'success',
        statusCode:200,
        doctors
    })
})