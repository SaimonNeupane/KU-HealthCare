import { Request, Response, NextFunction } from "express";
import { customRequest } from "./authenticateToken";
import HttpError from "../Errors/httpError";
import AsyncError from "../Errors/asyncError";

const authorization = (allowedRoles: string[]) => {
  return AsyncError((req: customRequest, res: Response, next: NextFunction) => {
    const role = req.user.role;
    console.log("user check", req.user);

    console.log("Authorization check:", {
      userRole: role,
      allowedRoles: allowedRoles,
      isAllowed: role && allowedRoles.includes(role),
    });

    if (!role || !allowedRoles.includes(role)) {
      console.log("Authorization failed for role:", role);
      return next(new HttpError(403, "Not allowed to access resource"));
    }

    console.log("Authorization successful for role:", role);
    next();
  });
};

export default authorization;
