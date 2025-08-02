import express, { Express, NextFunction, Request, Response } from "express";
import GlobalError from "./Errors/globalError";

import LoginRoutes from "./routes/loginRoute";
import RecepRoutes from "./routes/Receptionists/receptionistRoutes";
import assistantRoutes from "./routes/labAssistantRoute";
import doctorRoutes from "./routes/doctorRoute";
import adminRoutes from "./routes/adminRoutes";
import notificationRoutes from "./routes/notificationRoutes";

import bodyParser, { json } from "body-parser";
import morgan from "morgan";
import cors from "cors";

import http from "http";
import initializeSocket from "./services/socketServer";

const app: Express = express();

const port = Number(process.env.PORT) || 3000;
const httpServer = http.createServer(app);

initializeSocket(httpServer);

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});

app.use(`/receptionist`, RecepRoutes);
app.use(`/user`, LoginRoutes);
app.use("/lab", assistantRoutes);
app.use("/doctor", doctorRoutes);
app.use("/admin", adminRoutes);
app.use("/notification", notificationRoutes);

app.use((req: Request, res: Response, next: NextFunction): any => {
  return res.status(400).json({
    status: "Fail",
    statusCode: 404,
    Message: `The end-Ppint ${req.originalUrl} doesnot exists`,
  });
});

app.use(GlobalError);

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
});
