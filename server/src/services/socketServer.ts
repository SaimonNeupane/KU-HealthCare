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

    if (role === "doctor" && user_id) {
      socket.emit("doctor-online", { user_id });
      await prisma.doctor.updateMany({
        where: { userId: user_id },
        data: { is_online: true },
      });
    }

    console.log(socket.id, role, user_id);

    socket.on("message", ({ message }) => {
      console.log(message);
    });

    socket.on("send-lab-report", ({ patientName }) => {
      console.log(patientName);
      io.emit("lab-report-arrived", { patientName });
    });

    socket.on("new-patient-registered", ({ patientName }) => {
      console.log(patientName);
      io.emit("patient-registered", { patientName });
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
