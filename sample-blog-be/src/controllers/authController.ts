import { Request, Response } from "express"
import { IUser, User, Role, Status } from "../models/userModel"
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../utils/tokens";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/auth";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

// /api/v1/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required..!"
      })
    }

    const exUser = await User.findOne({ email })
    if (exUser) {
      return res.status(400).json({
        message: "User with this email alrady exists..!"
      })
    }

    if (role !== Role.USER && role !== Role.AUTHOR) {
      return res.status(400).json({
        message: "Invalid role specified..!"
      })
    }

    const approvedStatus = role === Role.AUTHOR ? Status.PENDING : Status.APPROVED

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      roles: [role],
      approved: approvedStatus
    })

    await newUser.save()

    res.status(201).json({
      message: role === Role.AUTHOR ? "Author registered succesfully" : "User registered succesfully",
      data: {
        id: newUser._id,
        email: newUser.email,
        roles: newUser.roles,
        approved: newUser.approved
      }
    })
  } catch (error) {
    console.error("Error occurred during registration:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// /api/v1/auth/login
export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
    
        const existingUser = await User.findOne({ email })
        if(!existingUser) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const accessToken = signAccessToken(existingUser)
        const refreshToken = signRefreshToken(existingUser)

        res.status(200).json({ 
            message: "Login successful", 
            data: { 
                email: existingUser.email, 
                roles: existingUser.roles, 
                accessToken,
                refreshToken
            } 
        })

    } catch (err:any) {
        res.status(500).json({ message: err?.message || "Internal server error" })
    }
}

// /api/v1/auth/me
export const getMyDetails = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized"})
  }

  const userId = req.user.sub
  const user = ((await User.findById(userId).select("-password")) as IUser) || null

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const { firstname, lastname, email, roles, approved } = user

  res.status(200).json({ message: "User details retrieved successfully", data: { firstname, lastname, email, roles, approved } })
}

// /api/v1/auth/admin/register
export const registerAdmin = async (req: Request, res: Response) => {
try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required..!"
      })
    }

    const exUser = await User.findOne({ email })
    if (exUser) {
      return res.status(400).json({
        message: "Admin with this email alrady exists..!"
      })
    }

    const role = Role.ADMIN
    
    const approvedStatus = Status.APPROVED

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      roles: [role],
      approved: approvedStatus
    })

    await newAdmin.save()

    res.status(201).json({
      message: "Admin registered succesfully",
      data: {
        id: newAdmin._id,
        email: newAdmin.email,
        roles: newAdmin.roles,
        approved: newAdmin.approved
      }
    })
  } catch (error) {
    console.error("Error occurred during registration:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body

    if(!token) {
      return res.status(400).json({ message: "Refresh token is required" })
    }

    const payload = jwt.verify(token, JWT_REFRESH_SECRET)
    const user = await User.findById(payload.sub)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    const accessToken = signAccessToken(user)
    res.status(200).json({ accessToken })
  } catch (error) {
    console.error("Error occurred during token refresh:", error)
    res.status(403).json({ message: "Invalid or Expired refresh token" })
  }
}