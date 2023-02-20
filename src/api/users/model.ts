import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserDocument, UserModel } from "./types";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    const plainPW = currentUser.password;
  }
});

export default model<UserDocument, UserModel>("User", UserSchema);
