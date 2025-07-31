import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data in correct order (respecting foreign key constraints)
  await prisma.labTest.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.labAssistant.deleteMany();
  await prisma.receptionist.deleteMany();
  await prisma.room.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data...");

  // Create Admin User FIRST
  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: "secure1234",
      role: "admin",
    },
  });

  console.log("Created admin user...");

  // Create 10 Departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: "General Medicine",
        description: "General medical care and consultation services",
      },
    }),
    prisma.department.create({
      data: {
        name: "Cardiology",
        description: "Heart and cardiovascular system specialists",
      },
    }),
    prisma.department.create({
      data: {
        name: "Orthopedics",
        description: "Bone, joint, and musculoskeletal system care",
      },
    }),
    prisma.department.create({
      data: {
        name: "Pediatrics",
        description: "Medical care for infants, children, and adolescents",
      },
    }),
    prisma.department.create({
      data: {
        name: "Neurology",
        description: "Brain and nervous system specialists",
      },
    }),
    prisma.department.create({
      data: {
        name: "Dermatology",
        description: "Skin, hair, and nail specialists",
      },
    }),
    prisma.department.create({
      data: {
        name: "Gastroenterology",
        description: "Digestive system and liver specialists",
      },
    }),
    prisma.department.create({
      data: {
        name: "Oncology",
        description: "Cancer treatment and care specialists",
      },
    }),
    prisma.department.create({
      data: {
        name: "Psychiatry",
        description: "Mental health and behavioral specialists",
      },
    }),
    prisma.department.create({
      data: {
        name: "Emergency Medicine",
        description: "Emergency and urgent care services",
      },
    }),
  ]);

  console.log("Created 10 departments...");

  // Create 20 Rooms (2 rooms per department)
  const rooms: any[] = [];
  for (let deptIndex = 0; deptIndex < departments.length; deptIndex++) {
    for (let roomNum = 1; roomNum <= 2; roomNum++) {
      const room = await prisma.room.create({
        data: {
          room_number: deptIndex * 100 + roomNum + 100, // 101-102, 201-202, etc.
          status: Math.random() > 0.2 ? "available" : "occupied",
          departmentId: departments[deptIndex].department_id,
        },
      });
      rooms.push(room);
    }
  }

  console.log("Created 20 rooms...");

  // Create Users and related entities
  const users: any[] = [adminUser]; // Include admin user in the users array
  const doctors: any[] = [];
  const labAssistants: any[] = [];
  const receptionists: any[] = [];

  const firstNames = [
    "Prabesh",
    "Keshav",
    "Parikchit",
    "Bijay",
    "Rajesh",
    "Suresh",
    "Ramesh",
    "Dinesh",
    "Mahesh",
    "Naresh",
    "Sita",
    "Gita",
    "Rita",
    "Mita",
    "Lila",
    "Kamala",
    "Radha",
    "Shanti",
    "Devi",
    "Maya",
    "Amit",
    "Sumit",
    "Rohit",
    "Mohit",
    "Ankit",
    "Nishant",
    "Prashant",
    "Ashish",
    "Manish",
    "Rakesh",
    "Aarti",
    "Bharti",
    "Shruti",
    "Kriti",
    "Preeti",
    "Sunita",
    "Kavita",
    "Lalita",
    "Mamta",
    "Rekha",
    "Deepak",
    "Vivek",
    "Avinash",
    "Prakash",
    "Subash",
    "Akash",
    "Bikash",
    "Mukesh",
    "Lokesh",
    "Yogesh",
  ];

  const lastNames = [
    "Sharma",
    "Thapa",
    "Gurung",
    "Tamang",
    "Rai",
    "Limbu",
    "Magar",
    "Shrestha",
    "Pradhan",
    "Adhikari",
    "Karki",
    "Khatri",
    "Chhetri",
    "Basnet",
    "Khadka",
    "Poudel",
    "Ghimire",
    "Regmi",
    "Subedi",
    "Pandey",
    "Aryal",
    "Koirala",
    "Bajracharya",
    "Joshi",
    "Acharya",
    "Bhattarai",
    "Parajuli",
    "Dahal",
    "Nepal",
    "Bhandari",
  ];

  const specializations = [
    "General Medicine",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "Neurology",
    "Dermatology",
    "Gastroenterology",
    "Oncology",
    "Psychiatry",
    "Emergency Medicine",
  ];

  let userIndex = 0;

  // Helper function to generate realistic Nepali phone numbers
  function generatePhoneNumber(index: number): string | null {
    const prefixes = [
      "980",
      "981",
      "982",
      "984",
      "985",
      "986",
      "988",
      "970",
      "971",
      "972",
    ];
    const prefix = prefixes[index % prefixes.length];
    const remaining = String(Math.floor(Math.random() * 10000000)).padStart(
      7,
      "0"
    );
    return `${prefix}${remaining}`;
  }

  // Create 20 doctors (2 per department)
  for (let deptIndex = 0; deptIndex < departments.length; deptIndex++) {
    const departmentRooms = rooms.filter(
      (r) => r.departmentId === departments[deptIndex].department_id
    );

    for (let i = 0; i < 2; i++) {
      const firstName = firstNames[userIndex % firstNames.length];
      const lastName = lastNames[userIndex % lastNames.length];
      const username = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${userIndex}`;

      const user = await prisma.user.create({
        data: {
          username,
          email: `${username}@hospital.com`,
          password: "password123",
          role: "doctor",
        },
      });
      users.push(user);

      // Assign doctor to a room in their department
      const assignedRoom = departmentRooms[i % departmentRooms.length];

      const doctor = await prisma.doctor.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          specialization: specializations[deptIndex],
          is_online: Math.random() > 0.3,
          departmentId: departments[deptIndex].department_id,
          userId: user.user_id,
          roomId: assignedRoom.room_id,
          workingFrom: `${8 + (i % 3)}:00`,
          workingTo: `${16 + (i % 3)}:00`,
          phone: generatePhoneNumber(userIndex),
        },
      });
      doctors.push(doctor);
      userIndex++;
    }
  }

  console.log("Created 20 doctors...");

  // Create 10 lab assistants
  for (let i = 0; i < 10; i++) {
    const firstName = firstNames[userIndex % firstNames.length];
    const lastName = lastNames[userIndex % lastNames.length];
    const username = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${userIndex}`;

    const user = await prisma.user.create({
      data: {
        username,
        email: `${username}@hospital.com`,
        password: "password123",
        role: "lab_assistant",
      },
    });
    users.push(user);

    const labAssistant = await prisma.labAssistant.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        userId: user.user_id,
      },
    });
    labAssistants.push(labAssistant);
    userIndex++;
  }

  console.log("Created 10 lab assistants...");

  // Create 3 receptionists
  for (let i = 0; i < 3; i++) {
    const firstName = firstNames[userIndex % firstNames.length];
    const lastName = lastNames[userIndex % lastNames.length];
    const username = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${userIndex}`;

    const user = await prisma.user.create({
      data: {
        username,
        email: `${username}@hospital.com`,
        password: "password123",
        role: "receptionist",
      },
    });
    users.push(user);

    const receptionist = await prisma.receptionist.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        userId: user.user_id,
        phone: generatePhoneNumber(userIndex + 100000),
      },
    });
    receptionists.push(receptionist);
    userIndex++;
  }

  console.log("Created 3 receptionists...");

  // Create 50 beds
  const beds: any[] = [];
  const bedStatuses = ["occupied", "available", "maintenance", "reserved"];
  for (let i = 1; i <= 50; i++) {
    const bed = await prisma.bed.create({
      data: {
        bed_number: i,
        status: bedStatuses[Math.floor(Math.random() * bedStatuses.length)],
      },
    });
    beds.push(bed);
  }

  console.log("Created 50 beds...");

  // Create 50 patients
  const patients: any[] = [];
  const genders = ["Male", "Female", "Other"];
  const addresses = [
    "Kathmandu, Nepal",
    "Lalitpur, Nepal",
    "Bhaktapur, Nepal",
    "Pokhara, Nepal",
    "Chitwan, Nepal",
    "Butwal, Nepal",
    "Biratnagar, Nepal",
    "Janakpur, Nepal",
    "Nepalgunj, Nepal",
    "Dharan, Nepal",
    "Hetauda, Nepal",
    "Itahari, Nepal",
    "Birgunj, Nepal",
    "Ghorahi, Nepal",
    "Damak, Nepal",
  ];

  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const availableBeds = beds.filter(
      (bed) => bed.status === "available" || bed.status === "occupied"
    );
    const bedId =
      Math.random() > 0.4 && availableBeds.length > 0
        ? availableBeds[Math.floor(Math.random() * availableBeds.length)].bed_id
        : null;

    const patient = await prisma.patient.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        age: Math.floor(Math.random() * 80) + 1,
        gender: genders[Math.floor(Math.random() * genders.length)],
        contact_number: `98${String(
          Math.floor(Math.random() * 100000000)
        ).padStart(8, "0")}`,
        address: addresses[Math.floor(Math.random() * addresses.length)],
        bedId,
      },
    });
    patients.push(patient);
  }

  console.log("Created 50 patients...");

  // Create 50 appointments
  const appointments: any[] = [];
  const appointmentStatuses = [
    "scheduled",
    "completed",
    "cancelled",
    "in-progress",
    "waiting",
  ];

  for (let i = 0; i < 50; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];

    // Ensure room belongs to the same department as the doctor
    const doctorRoom = rooms.find((r) => r.room_id === doctor.roomId);
    if (!doctorRoom) {
      console.error(`No room found for doctor ${doctor.doctor_id}`);
      continue;
    }

    // Generate appointment times over the last 30 days and next 30 days
    const baseTime = new Date("2025-07-29T16:18:31Z");
    const randomDays = Math.floor(Math.random() * 60) - 30; // -30 to +30 days
    const randomHours = Math.floor(Math.random() * 10) + 8; // 8 AM to 6 PM
    const randomMinutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45 minutes

    const appointmentTime = new Date(baseTime);
    appointmentTime.setDate(appointmentTime.getDate() + randomDays);
    appointmentTime.setHours(randomHours, randomMinutes, 0, 0);

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.patient_id,
        doctorId: doctor.doctor_id,
        roomId: doctorRoom.room_id,
        departmentId: doctor.departmentId,
        appointment_time: appointmentTime,
        status:
          appointmentStatuses[
            Math.floor(Math.random() * appointmentStatuses.length)
          ],
        is_emergency: Math.random() > 0.85,
      },
    });
    appointments.push(appointment);
  }

  console.log("Created 50 appointments...");

  // Create 25 lab tests
  const labTests: any[] = [];
  const testStatuses = ["pending", "in-progress", "completed", "cancelled"];
  const testResults = [
    "Normal",
    "Abnormal - High",
    "Abnormal - Low",
    "Inconclusive",
    "Positive",
    "Negative",
    "Within Range",
    "Outside Range",
  ];

  for (let i = 0; i < 25; i++) {
    const appointment =
      appointments[Math.floor(Math.random() * appointments.length)];
    const labAssistant =
      labAssistants[Math.floor(Math.random() * labAssistants.length)];
    const status =
      testStatuses[Math.floor(Math.random() * testStatuses.length)];

    let completionTime: Date | null = null;
    let result: string | null = null;

    if (status === "completed") {
      completionTime = new Date(appointment.appointment_time);
      completionTime.setHours(
        completionTime.getHours() + Math.floor(Math.random() * 48)
      );
      result = testResults[Math.floor(Math.random() * testResults.length)];
    }

    const labTest = await prisma.labTest.create({
      data: {
        appointmentId: appointment.appointment_id,
        patientId: appointment.patientId,
        requesting_doctor_id: appointment.doctorId!,
        labAssistantId:
          Math.random() > 0.2 ? labAssistant.lab_assistant_id : null,
        status,
        completion_time: completionTime,
        result,
      },
    });
    labTests.push(labTest);
  }

  console.log("Created 25 lab tests...");

  // Create 50 notifications
  for (let i = 0; i < 50; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    const recipient = users[Math.floor(Math.random() * users.length)];

    if (sender.user_id !== recipient.user_id) {
      await prisma.notification.create({
        data: {
          sender_user_id: sender.user_id,
          recipient_user_id: recipient.user_id,
          is_read: Math.random() > 0.4,
        },
      });
    }
  }

  console.log("Created 50 notifications...");

  console.log("\n=== DATABASE SEEDING COMPLETED SUCCESSFULLY! ===");
  console.log(`Created:`);
  console.log(`- ${users.length} Users (including admin)`);
  console.log(`- ${departments.length} Departments`);
  console.log(`- ${rooms.length} Rooms`);
  console.log(`- ${doctors.length} Doctors`);
  console.log(`- ${labAssistants.length} Lab Assistants`);
  console.log(`- ${receptionists.length} Receptionists`);
  console.log(`- ${beds.length} Beds`);
  console.log(`- ${patients.length} Patients`);
  console.log(`- ${appointments.length} Appointments`);
  console.log(`- ${labTests.length} Lab Tests`);
  console.log(`- 50 Notifications`);

  // Display login credentials
  const prabeshDoctor = doctors.find(
    (d) => d.first_name === "Prabesh" && d.last_name === "Sharma"
  );
  console.log(`\n=== LOGIN CREDENTIALS ===`);
  console.log(`ADMIN:`);
  console.log(`  Username: admin`);
  console.log(`  Email: admin@example.com`);
  console.log(`  Password: secure1234`);
  console.log(`  Role: admin`);
  console.log(`\nDOCTOR (Prabesh-Sharma):`);
  console.log(`  Username: prabesh-sharma-0`);
  console.log(`  Password: password123`);
  console.log(`  Role: doctor`);
  console.log(`  Phone: ${prabeshDoctor?.phone || "N/A"}`);
  console.log(`  Department: ${departments[0]?.name || "General Medicine"}`);
  console.log(`========================`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
