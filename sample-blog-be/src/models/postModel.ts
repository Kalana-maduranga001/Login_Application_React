import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    tags: string[];
    imageURL: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    imageURL: { type: String, required: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Post = mongoose.model<IPost>("Post", postSchema);