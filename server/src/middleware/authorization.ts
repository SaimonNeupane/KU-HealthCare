import { Request, Response, NextFunction } from "express";
import { customRequest } from "./authenticateToken";
import HttpError from "../Errors/httpError";
import AsyncError from "../Errors/asyncError";


const authorization: any = (allowedRoles: string[]): any => {
    return (
        AsyncError(

            (req: customRequest, res: Response, next: NextFunction) => {
                const role = req.user?.role
                if (!allowedRoles.includes(role)) {
                    next(new HttpError(402, 'Not allowed to access resource'))
                }
                next();
            }
        )
    )
}


export default authorization



