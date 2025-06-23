import express, { Express, NextFunction, Request, Response } from "express";
import HttpError from "./Errors/httpError";
import GlobalError from "./Errors/globalError";


const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running");
});
app.use((req:Request,res:Response,next:NextFunction):any=>{
  return res.status(400).json({
    status:"Fail",
    statusCode:404,
    Message:`The end-Ppint ${req.originalUrl} doesnot exists`
  })
})

app.use(GlobalError)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
