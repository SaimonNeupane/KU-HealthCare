import { NextFunction, Request, Response } from 'express';
import AsyncError from '../Errors/asyncError';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
import HttpError from '../Errors/httpError';

configDotenv()

const prisma = new PrismaClient();

interface customRequest extends Request{
    user?:any
}

export const login: any = AsyncError(async (req: customRequest, res: Response, next: NextFunction): Promise<any> => {

    const { email, password, role } = req.body
    const found = await prisma.user.findFirst({ where: { email } })
    if (found?.password === password) {
      
            
              const  token = jwt.sign({ email, role }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' })
              req.user=found
            
            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                token,
                user:req.user
                

            })

        

    }
    next (new HttpError(402,'unauthorized'))


})