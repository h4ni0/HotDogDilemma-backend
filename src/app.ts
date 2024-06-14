import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { Server as HttpServer } from "http";
import dotenv from "dotenv";
import answersRouter from "./routes/answers";
import cors from "cors";

dotenv.config();

const app: express.Application = express();
const httpServer: HttpServer = createServer(app);

const io: Server = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/answers", answersRouter);

// mongodb connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });


// graceful shutdown
const shutDown = () => {
  mongoose.connection.close(false).then(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  })
}

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);

export { app, io, httpServer };
