import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET)
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.error("Checking admin role for user:", req.user);
    if (req.user.role.includes("ADMIN")) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Admins only" });
    }
}

export const isAdminOrAuthor = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.error("Checking admin or author role for user:", req.user);
    if (req.user.role.includes("ADMIN") || req.user.role.includes("AUTHOR")) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Admins or Authors only" });
    }
}