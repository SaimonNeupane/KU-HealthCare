import { Request,Response,NextFunction } from "express";


export const check:any=(req:Request,res:Response,next:NextFunction)=>{
    return res.status(200).json({
        message:'ggood'
    })
}