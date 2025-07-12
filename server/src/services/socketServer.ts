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
    socket.on("labreportarrived", ({ patientName }) => {
      socket.emit("doctornotif", patientName);
    });
  });

  return () => {
    io.close();
  };
};

export default initializeSocket;
