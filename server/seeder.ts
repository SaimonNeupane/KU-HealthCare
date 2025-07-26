import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data in correct order (children first)
  await prisma.labTest.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.receptionist.deleteMany();
  await prisma.labAssistant.deleteMany();
  await prisma.room.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Database cleared.");

  // Create Users
  const saimonUser = await prisma.user.create({
    data: {
      username: "saimon_neupane",
      email: "saimon@example.com",
      password: "secure1234",
      role: "lab_assistant",
    },
  });

  const prabeshUser = await prisma.user.create({
    data: {
      username: "prabesh_sharma",
      email: "prabesh@example.com",
      password: "secure1234",
      role: "doctor",
    },
  });

  const rishamUser = await prisma.user.create({
    data: {
      username: "risham_raj",
      email: "risham@example.com",
      password: "secure1234",
      role: "receptionist",
    },
  });

  const keshavUser = await prisma.user.create({
    data: {
      username: "keshav_sharma",
      email: "keshav@example.com",
      password: "secure1234",
      role: "doctor",
    },
  });

  const parikchitUser = await prisma.user.create({
    data: {
      username: "parikchit_sen",
      email: "parikchit@example.com",
      password: "secure1234",
      role: "doctor",
    },
  });

  // Create Department
  const generalDept = await prisma.department.create({
    data: {
      name: "General Medicine",
      description: "General health and treatment",
    },
  });

  const cardioDept = await prisma.department.create({
    data: {
      name: "Cardiology",
      description: "Cardio health and treatment",
    },
  });

  const orthoDept = await prisma.department.create({
    data: {
      name: "Orthopedics",
      description: "Ortho health and treatment",
    },
  });

  const pediaDept = await prisma.department.create({
    data: {
      name: "Pediatrics",
      description: "Pedia health and treatment",
    },
  });

  // Create Room
  const room1 = await prisma.room.create({
    data: {
      room_number: 101,
      status: "available",
      departmentId: generalDept.department_id,
    },
  });

  // Create Lab Assistant
  await prisma.labAssistant.create({
    data: {
      first_name: "Saimon",
      last_name: "Neupane",
      userId: saimonUser.user_id,
    },
  });

  // Create Receptionist
  await prisma.receptionist.create({
    data: {
      first_name: "Risham",
      last_name: "Raj",
      userId: rishamUser.user_id,
    },
  });

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
      workingFrom: "9",
      workingTo: "4",
    },
  });

  await prisma.doctor.create({
    data: {
      first_name: "Keshav",
      last_name: "Sharma",
      specialization: "Neurology",
      is_online: false,
      departmentId: generalDept.department_id,
      userId: keshavUser.user_id,
      roomId: room1.room_id,
      workingFrom: "9",
      workingTo: "4",
    },
  });

  await prisma.doctor.create({
    data: {
      first_name: "Parikchit",
      last_name: "Sen",
      specialization: "Dermatology",
      is_online: true,
      departmentId: generalDept.department_id,
      userId: parikchitUser.user_id,
      roomId: room1.room_id,
      workingFrom: "9",
      workingTo: "4",
    },
  });

  // Create new users
  const anishaUser = await prisma.user.create({
    data: {
      username: "anisha_khadka",
      email: "anisha@example.com",
      password: "test1234",
      role: "lab_assistant",
    },
  });

  const bijayUser = await prisma.user.create({
    data: {
      username: "bijay_gurung",
      email: "bijay@example.com",
      password: "test1234",
      role: "doctor",
    },
  });

  const kabitaUser = await prisma.user.create({
    data: {
      username: "kabita_basnet",
      email: "kabita@example.com",
      password: "test1234",
      role: "receptionist",
    },
  });

  // Create new Department & Room
  const neuroDept = await prisma.department.create({
    data: {
      name: "Neurology",
      description: "Brain and nervous system related care",
    },
  });

  const room2 = await prisma.room.create({
    data: {
      room_number: 202,
      status: "available",
      departmentId: neuroDept.department_id,
    },
  });

  // Create Lab Assistant
  const anishaAssistant = await prisma.labAssistant.create({
    data: {
      first_name: "Anisha",
      last_name: "Khadka",
      userId: anishaUser.user_id,
    },
  });

  // Create Receptionist
  await prisma.receptionist.create({
    data: {
      first_name: "Kabita",
      last_name: "Basnet",
      userId: kabitaUser.user_id,
    },
  });

  // Create Doctor
  const bijayDoctor = await prisma.doctor.create({
    data: {
      first_name: "Bijay",
      last_name: "Gurung",
      specialization: "Neurology",
      is_online: true,
      departmentId: neuroDept.department_id,
      userId: bijayUser.user_id,
      roomId: room2.room_id,
      workingFrom: "10",
      workingTo: "5",
    },
  });

  // Create a Bed & Patient
  const bed2 = await prisma.bed.create({
    data: {
      status: "occupied",
    },
  });
  const existingBeds = await prisma.bed.count();
  if (existingBeds >= 50) {
    console.log("Beds already seeded.");
    return;
  }

  const bedData = Array.from({ length: 50 }, (_, i) => ({
    bed_number: i + 1,
    status: "available",
  }));

  await prisma.bed.createMany({
    data: bedData,
    skipDuplicates: true,
  });

  console.log("✅ 50 beds created.");

  const patient2 = await prisma.patient.create({
    data: {
      first_name: "Sujan",
      last_name: "Thapa",
      age: 33,
      gender: "Male",
      contact_number: "9811223344",
      address: "Pokhara",
      bedId: bed2.bed_id,
    },
  });

  // Create an Appointment
  const appointment2 = await prisma.appointment.create({
    data: {
      patientId: patient2.patient_id,
      doctorId: bijayUser.user_id,
      roomId: room2.room_id,
      appointment_time: new Date(),
      status: "scheduled",
      is_emergency: false,
    },
  });

  // Create LabTest
  await prisma.labTest.create({
    data: {
      appointmentId: appointment2.appointment_id,
      patientId: patient2.patient_id,
      requesting_doctor_id: bijayDoctor.doctor_id,
      labAssistantId: anishaAssistant.lab_assistant_id,
      status: "pending",
      completion_time: new Date(Date.now() + 2 * 3600000), // 2 hours later
      result: "Not available yet",
    },
  });

  console.log(
    "✅ Extra dummy users, doctor, lab assistant, patient, and labtest seeded."
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
