import { User } from "../../api/users/types";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
