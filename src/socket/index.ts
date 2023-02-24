import { Socket } from "socket.io";
import MessagesModel from "../api/messages/model";
interface payload {
  username: String;
}

interface user {
  username: String;
  socketId: String;
}

interface message {
  sender: String;
  content: {
    text: String;
    media: String;
  };
}

interface privateMessage {
  content: String;
  receiver: String;
  createdAt: String;
}

let onlineUsers: user[] = [];

export const newConnectionHandler = (newClient: any) => {
  newClient.emit("welcome", { message: `Hello ${newClient.id}` });

  newClient.on("setUsername", (payload: payload) => {
    onlineUsers.push({ username: payload.username, socketId: newClient.id });
    console.log(onlineUsers);
  });

  newClient.emit("loggedIn", onlineUsers);

  newClient.on("sendMessage", async (message: message) => {
    newClient.broadcast.emit("newMessage", message);
  });

  newClient.on("privateMessage", (payload: privateMessage) => {
    const index = onlineUsers.findIndex(
      (user) => user.username === payload.receiver
    );
    if (index !== -1) {
      const receiver = onlineUsers[index];
      newClient.to(receiver.socketId).emit(payload.content);
      console.log(payload.content);
    }
  });
};
