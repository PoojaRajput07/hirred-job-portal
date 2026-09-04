import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import { authRouter } from "./router/auth.router.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import recruiterRouter from "./router/recruiter.router.js";
import candidateRouter from "./router/candidate.router.js";


dotenv.config();
connectDB();
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth",authRouter);
app.use("/api/recruiter",recruiterRouter);
app.use("/api/candidate",candidateRouter)


app.get("/",(req,res)=>{
    console.log("backened connected");
    res.send("backend is running");

})
const port=process.env.PORT||5000;
app.listen(port,()=>{
    console.log("server is live on",port);
})

export default app;