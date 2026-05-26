import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import connectDB from "./config/mongodb.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

//security middleware
app.use(helmet());

//middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

//api endpoints
app.use('/api/auth', authRouter)

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
