import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create Users
  const saimonUser = await prisma.user.create({
    data: {
      username: "saimon_neupane",
      email: "saimon@example.com",
      password: "secure1234",
      role: "lab_assistant",
    },
  })

  const prabeshUser = await prisma.user.create({
    data: {
      username: "prabesh_sharma",
      email: "prabesh@example.com",
      password: "secure1234",
      role: "doctor",
    },
  })

  const rishamUser = await prisma.user.create({
    data: {
      username: "risham_raj",
      email: "risham@example.com",
      password: "secure1234",
      role: "receptionist",
    },
  })

  const keshavUser = await prisma.user.create({
    data: {
      username: "keshav_sharma",
      email: "keshav@example.com",
      password: "secure1234",
      role: "doctor",
    },
  })

  const parikchitUser = await prisma.user.create({
    data: {
      username: "parikchit_sen",
      email: "parikchit@example.com",
      password: "secure1234",
      role: "doctor",
    },
  })

  // Create Department
  const generalDept = await prisma.department.create({
    data: {
      name: "General Medicine",
      description: "General health and treatment",
    },
  })

  // Create Room
  const room1 = await prisma.room.create({
    data: {
      room_number: 101,
      status: "available",
      departmentId: generalDept.department_id,
    },
  })

  // Create Lab Assistant
  await prisma.labAssistant.create({
    data: {
      first_name: "Saimon",
      last_name: "Neupane",
      userId: saimonUser.user_id,
    },
  })

  // Create Receptionist
  await prisma.receptionist.create({
    data: {
      first_name: "Risham",
      last_name: "Raj",
      userId: rishamUser.user_id,
    },
  })

  // Create Doctors
  await prisma.doctor.create({
    data: {
      first_name: "Prabesh",
      last_name: "Sharma",
      specialization: "Cardiology",
      is_online: true,
      departmentId: generalDept.department_id,
      userId: prabeshUser.user_id,
      roomId: room1.room_id,
    },
  })

  await prisma.doctor.create({
    data: {
      first_name: "Keshav",
      last_name: "Sharma",
      specialization: "Neurology",
      is_online: false,
      departmentId: generalDept.department_id,
      userId: keshavUser.user_id,
      roomId: room1.room_id,
    },
  })

  await prisma.doctor.create({
    data: {
      first_name: "Parikchit",
      last_name: "Sen",
      specialization: "Dermatology",
      is_online: true,
      departmentId: generalDept.department_id,
      userId: parikchitUser.user_id,
      roomId: room1.room_id,
    },
  })

  console.log("Database seeded successfully.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
