import express, { Express, NextFunction, Request, Response } from "express";
import GlobalError from "./Errors/globalError";

import LoginRoutes from './routes/loginRoute'
import RecepRoutes from './routes/Receptionists/receptionistRoutes'

import assistantRoutes from "./routes/labAssistantRoute";

import bodyParser, { json } from "body-parser";

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});

app.use(`/receptionist`,RecepRoutes)


app.use(`/user`, LoginRoutes);
app.use("/lab", assistantRoutes);

app.use((req: Request, res: Response, next: NextFunction): any => {

  return res.status(400).json({
    status: "Fail",
    statusCode: 404,
    Message: `The end-Ppint ${req.originalUrl} doesnot exists`,
  });
});

app.use(GlobalError);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
