import { Server as HttpServer } from "http";
import { Server } from "socket.io";

const room = new Map();

const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(socket.id);
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
  });

  return () => {
    io.close();
  };
};

export default initializeSocket;
