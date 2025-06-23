
import { NextFunction, Request,Response } from "express"
import HttpError from "./httpError"
const AsyncError:any=(func:any)=>{
    return  async (req:Request,res:Response,next:NextFunction)=>{
        try{
            await func(req,res,next)

        }catch(error){
            next(error)
        }
    }
}

export default AsyncError