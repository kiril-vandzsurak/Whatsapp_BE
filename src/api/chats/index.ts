import express from "express";
import createHttpError from "http-errors";
import ChatsModel from "./model";
import UsersModel from "../users/model";
import { JWTAuthMiddleware, UserRequest } from "../../lib/auth/jwtAuth";
import { ObjectId } from "mongoose";

const chatsRouter = express.Router();

chatsRouter.get(
  "/me/chats",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      //Returns all the chats in which the user is a member.
      const chats = await ChatsModel.find(
        {
          members: { $in: [req.user?._id] },
        },
        { messages: 0, __v: 0 }
      );
      res.send(chats);
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
      const membersArray = [...req.body.receiver, req.user?._id];
      console.log(membersArray);
      const chats = await ChatsModel.find({
        members: {
          $eq: [req.user?._id, ...req.body.receiver],
        },
      });

      if (chats.length === 0) {
        console.log(chats);
        const newChat = new ChatsModel({
          members: [req.user?._id, req.body.receiver],
        });
        const { _id } = await newChat.save();
        res.send({ _id });
      } else {
        res.send(chats);
      }
    } catch (error) {
      next(error);
    }
  }
);

chatsRouter.put(
  "/test/:chatId",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    const updatedChat = await ChatsModel.findByIdAndUpdate(
      req.params.chatId,
      {
        $push: { members: req.body.receiver },
      },
      { new: true }
    );
    res.send(updatedChat);
  }
);

export default chatsRouter;
