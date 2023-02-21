import GoogleStrategy from "passport-google-oauth20";
import UserModel from "../../api/users/model";
import { createAccessToken } from "./tools";

const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: `${process.env.BE_URL}/users/googleRedirect`,
});
