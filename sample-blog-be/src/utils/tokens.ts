import dotenv from "dotenv";
import { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signAccessToken = (user: IUser): string => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.roles,
    },
    JWT_SECRET,
    { expiresIn: "30m" }
  );
};

const JWT_SECRET_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const signRefreshToken = (user: IUser): string => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.roles,
    },
    JWT_SECRET_SECRET,
    { expiresIn: "7d" }
  );
};
