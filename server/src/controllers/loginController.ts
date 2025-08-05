import { NextFunction, Request, Response } from "express";
import AsyncError from "../Errors/asyncError";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import HttpError from "../Errors/httpError";
import bcrypt from "bcrypt";

configDotenv();

const prisma = new PrismaClient();

export interface customRequest extends Request {
  user?: any;
}

export const login = AsyncError(
  async (
    req: customRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return next(new HttpError(400, "Email and password are required"));
    }

    // Find user by email
    const found = await prisma.user.findFirst({ where: { email } });

    if (!found) {
      return next(new HttpError(401, "Invalid credentials"));
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, found.password);
    if (!isMatch) {
      return next(new HttpError(401, "Invalid credentials"));
    }

    const userId = found.user_id;

    // Generate JWT token
    const token = jwt.sign(
      { email, role: found.role, userId },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "1h",
      }
    );

    req.user = found;
    console.log(req.user);

    res.status(200).json({
      status: "Success",
      statusCode: 200,
      token,
      userId,
    });
  }
);
