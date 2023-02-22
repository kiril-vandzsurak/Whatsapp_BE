import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import {
  badRequestHandler,
  unauthorizedErrorHandler,
  forbiddenErrorHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers";
import usersRouter from "./api/users";
import { AppUser, UserDocument } from "./api/users/types";
import googleStrategy from "./lib/auth/google";
import passport from "passport";

const server = express();

const port = process.env.PORT || 3001;

passport.use("google", googleStrategy);

server.use(cors());
server.use(express.json());
server.use(passport.initialize());

server.use("/users", usersRouter);

server.use(badRequestHandler);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL!);

mongoose.connection.on("connected", () => {
  console.log("connected");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});

declare global {
  namespace Express {
    export interface Request {
      user?: Partial<UserDocument>;
    }
  }
}
