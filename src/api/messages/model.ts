import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MessagesSchema = new Schema(
  {
    sender: { type: String, required: true },
    content: {
      text: { type: String, required: true },
      media: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default model("Message", MessagesSchema);
