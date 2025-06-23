import { NextFunction, Request, Response } from 'express';
import AsyncError from '../Errors/asyncError';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
import HttpError from '../Errors/httpError';

configDotenv()

const prisma = new PrismaClient();

export const login: any = AsyncError(async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    const { username, password, role } = req.body
    const found = await prisma.user.findFirst({ where: { username } })
    if (found?.password === password) {
        if (found?.role === role) {
            
            
              const  token = jwt.sign({ username, role }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' })
            
            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                token

            })

        }

    }
    next (new HttpError(402,'unauthorized'))


})