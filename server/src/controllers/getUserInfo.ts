import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export async function getUserInfo(req: Request, res: Response) {
  const user = await prisma.user.findFirst({
    where: { email: (req as any).user.email },
    select: { email: true, username: true, role: true, created_at: true },
  });
  console.log(user);
  return res.status(200).json(user);
}
