import express from "express";
import createHttpError from "http-errors";
import ChatsModel from "./model";
import UsersModel from "../users/model";
import { JWTAuthMiddleware, UserRequest } from "../../lib/auth/jwtAuth";

const chatsRouter = express.Router();

chatsRouter.get(
  "/me/chats",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      //Returns all the chats in which the user is a member.
      const user = UsersModel.findById(req.user!._id);
      const chatList = user.chats;
      //NO chat history provided.
    } catch (error) {
      next(error);
    }
  }
);

chatsRouter.post(
  "/me/chats",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      console.log("--------------------------------", req.user);
      const chat = {
        members: [req.user?._id],
      };
      const newChat = new ChatsModel(chat);
      const { _id } = await newChat.save();
      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

export default chatsRouter;
