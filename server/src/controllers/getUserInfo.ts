import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export async function getUserInfo(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { user_id: (req as any).user.userId },
    select: { email: true, username: true, role: true, user_id: true },
  });
  console.log(user);
  return res.status(200).json(user);
}
