
import { NextFunction, Request,Response } from "express"
import HttpError from "./httpError"
const AsyncError:any=(func:any)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        func(req,res,next).catch((error:HttpError)=>next(error))
    }
}