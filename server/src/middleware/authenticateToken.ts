import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HttpError from "../Errors/httpError";
import AsyncError from "../Errors/asyncError";

export interface customRequest extends Request {
  user?: any;
}

const AuthenticateToken: any = AsyncError(
  async (req: customRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      next(new HttpError(402, "Access Token is required"));
    }
    const verified = jwt.verify(token!, process.env.JWT_SECRET_KEY!);
    console.log(verified);
    req.user = verified;
    next();
  }
);

export default AuthenticateToken;
