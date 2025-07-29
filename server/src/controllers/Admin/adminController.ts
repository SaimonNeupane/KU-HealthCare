import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export function ShowDoctors() {
  const docData = prisma.user.findMany({
    where: {
      role: "doctor",
    },
    select: {
      email: true,
      doctor: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  });
}
