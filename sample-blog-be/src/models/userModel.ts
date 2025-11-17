import mongoose, { Document, Schema } from "mongoose"

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    AUTHOR = "AUTHOR"
}

export enum Status {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  firstname: string
  lastname: string
  email: string
  password: string
  roles: Role[]
  approved: Status
}

const userSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: Object.values(Role), default: [Role.USER] },
    approved: { type: String, enum: Object.values(Status), default: Status.PENDING }
  },
  { timestamps: true }
)

export const User = mongoose.model<IUser>("User", userSchema)
