import { PrismaClient } from "@prisma/client";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";

const room = new Map();
const prisma = new PrismaClient();

const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    const role = socket.handshake.auth.role;
    const user_id = socket.handshake.auth.user_id;

    socket.on("join-room", ({ roomId, role }) => {
      console.log("join room", roomId, role);
      if (role === "doctor") {
        socket.join(roomId);
      }
      if (role === "admin") {
        socket.join("admin");
      }
    });

    if (role === "doctor" && user_id) {
      await prisma.doctor.updateMany({
        where: { userId: user_id },
        data: { is_online: true },
      });
    }

    // console.log(socket.id, role, user_id);

    // socket.on("request-lab-report", ({ patientName }) => {
    //   console.log(patientName);
    //   io.emit("emit-request-lab-report", { patientName });
    // });

    socket.on(
      "send-lab-report",
      async ({ patientName, id, sender_id, recipient_id }) => {
        console.log(
          "lab report data",
          patientName,
          id,
          sender_id,
          recipient_id
        );

        try {
          if (!!recipient_id && !!sender_id && !!id) {
            const doctor = await prisma.doctor.findUnique({
              where: { doctor_id: recipient_id },
              select: { userId: true, first_name: true },
            });

            const labAssistant = await prisma.labAssistant.findUnique({
              where: { userId: sender_id },
              select: { userId: true },
            });

            if (!doctor?.userId) {
              console.error(`Doctor not found with doctor_id: ${recipient_id}`);
              return;
            }

            if (!labAssistant?.userId) {
              console.error(
                `Lab assistant not found with lab_assistant_id: ${sender_id}`
              );
              return;
            }

            await prisma.notification.create({
              data: {
                message: "lab report arrived",
                recipient_user_id: doctor.userId,
                sender_user_id: labAssistant.userId,
                userUser_id: id,
              },
            });
            console.log("doctor id check", doctor.userId);

            io.to(doctor.userId).emit("emit-lab-report-arrived", {
              patientName,
              patientId: id,
            });

            io.to("admin").emit("emit-lab-report-arrived", {
              patientName,
              patientId: id,
              doctorName: doctor.first_name,
            });
            console.log("Notification created successfully");
          }
        } catch (error) {
          console.error("Error in send-lab-report:", error);
        }
      }
    );

    socket.on("new-patient-registered", async ({ patientName, doctorId }) => {
      console.log(
        "PATIENT REGISTERED EVENT TRIGGERED!!!",
        patientName,
        doctorId
      );

      const doctor = await prisma.doctor.findUnique({
        where: { doctor_id: doctorId },
        select: { userId: true, first_name: true },
      });

      if (doctor) {
        io.to("admin").emit("emit-patient-registered", {
          patientName,
          doctorName: doctor.first_name,
        });
        io.to(doctor.userId).emit("emit-patient-registered", { patientName });
      }
    });

    socket.on("bed-assigned", ({ patientName }) => {
      // console.log(patientName);
      io.emit("emit-bed-assign", { patientName });
    });

    socket.on("disconnect", async () => {
      if (role === "doctor" && user_id) {
        await prisma.doctor.updateMany({
          where: { userId: user_id },
          data: { is_online: false },
        });
      }
    });
  });

  return () => {
    io.close();
  };
};

export default initializeSocket;
