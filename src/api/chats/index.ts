import express from "express";
import createHttpError from "http-errors";
import ChatsModel from "./model";
import UsersModel from "../users/model";

const chatsRouter = express.Router();

chatsRouter.get("/me/chats", async (req, res, next) => {
  try {
    //Returns all the chats in which the user is a member.
    const user = UsersModel.findById(req.params.userId);
    if (user) {
      res.send(user.chats);
      //NO chat history provided.
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

chatsRouter.post("/", async (req, res, next) => {
  // Should check if the request sender has already an active chat with this recipient and return it if present. Otherwise it creates a new chat
});
