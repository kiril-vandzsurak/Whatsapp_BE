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
import messagesRouter from "./api/messages";
import chatsRouter from "./api/chats";

const server = express();

server.use(cors());
server.use(express.json());

const port = process.env.PORT || 3001;

server.use("/users", usersRouter);
server.use("/", chatsRouter);
server.use("/chat", messagesRouter);

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
