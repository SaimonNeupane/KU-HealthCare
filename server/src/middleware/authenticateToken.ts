import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HttpError from "../Errors/httpError";
import AsyncError from "../Errors/asyncError";

export interface customRequest extends Request {
  user?: any;
}

const AuthenticateToken = AsyncError(
  async (req: customRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // DEBUG: Log the authorization header
    console.log("=== TOKEN DEBUG ===");
    console.log("Authorization Header:", authHeader);
    console.log("Headers:", req.headers);

    // More robust token extraction
    let token: string | undefined;

    if (authHeader) {
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      } else {
        token = authHeader; // In case token is sent without Bearer prefix
      }
    }

    console.log("Extracted Token:", token);
    console.log("Token Length:", token?.length);
    console.log("=================");

    if (!token || token.trim() === "") {
      console.log("❌ No token found");
      return next(new HttpError(401, "Access Token is required"));
    }

    try {
      const verified = jwt.verify(token.trim(), process.env.JWT_SECRET_KEY!);
      console.log("✅ JWT Verified Successfully:", verified);
      req.user = verified;
      next();
    } catch (error) {
      console.log("❌ JWT verification failed:", error);
      return next(new HttpError(403, "Invalid or expired token"));
    }
  }
);

export default AuthenticateToken;
