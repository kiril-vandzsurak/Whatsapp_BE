import express from "express";
import MessageModel from "./model";
import ChatsModel from "../chats/model";
import createHttpError from "http-errors";
import { JWTAuthMiddleware, UserRequest } from "../../lib/auth/jwtAuth";

const messagesRouter = express.Router();

// ********************************** POST ********************************** */

messagesRouter.post(
  "/:chatId/messages",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const chat = await ChatsModel.findById(req.params.chatId);
      if (chat) {
        const newMessage = new MessageModel({
          sender: req.user?._id,
          content: req.body,
        });
        const { _id } = await newMessage.save();
        const updatedChat = await ChatsModel.findByIdAndUpdate(
          req.params.chatId,
          { $push: { messages: { _id } } }
        );
        res.status(201).send({ updatedChat });
      } else {
        next(
          createHttpError(404, `User with id ${req.params.chatId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// *********************************** GET ********************************** */

messagesRouter.get(
  "/:chatId/messages",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const chat = await ChatsModel.findById(req.params.chatId).populate({
        path: "messages",
      });
      if (chat) res.send(chat);
      else {
        next(
          createHttpError(404, `Chat with id ${req.params.chatId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default messagesRouter;
