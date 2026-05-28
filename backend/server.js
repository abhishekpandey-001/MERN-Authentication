import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import connectDB from "./config/mongodb.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

//security middleware
app.use(helmet());

//middlewares
app.use(express.json());
app.use(cookieParser());

//api endpoints
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

//health check
app.get("/", (req, res) => {
  return res.send("API is working...");
});

//fallback middlewares
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(port, () => console.log(`Server started on PORT: ${port}`));
};

startServer();
