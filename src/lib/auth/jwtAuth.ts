import createHttpError from "http-errors";
import { RequestHandler, Request, NextFunction, Response } from "express";
import { verifyAccessToken } from "./tools";
import { TokenPayload } from "./tools";


export const JWTAuthMiddleware: RequestHandler = async (req, res, next) => {
  const user = req.user;

export interface UserRequest extends Request {
  user?: TokenPayload;
}

  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide Bearer Token in the authorization header!"
      )
    );
  } else {
    try {
      const accessToken = req.headers.authorization.replace("Bearer ", "");
      const payload = await verifyAccessToken(accessToken);

      req.user = {
        _id: payload._id,
        name: payload.name,
      };
      next();
    } catch (error) {
      console.log(error);
      next(createHttpError(401, "Token not valid!"));
    }
  }
};
