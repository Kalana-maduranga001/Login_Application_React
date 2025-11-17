import { Request, Response } from "express";
import { IPost, Post } from "../models/postModel";
import cloudinary from "../config/cloudinary";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";

export const savePost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    
    if (!req.user.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    let imageURL = "";

    if (req.file) {
      const result:any = await new Promise((resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: "smart_blog/posts" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        
        upload_stream.end(req.file?.buffer)
      });

      imageURL = result.secure_url;
    }

    const newPost = new Post({
      title,
      content,
      tags: tags ? tags.split(",") : [],
      imageURL,
      author: req.user.sub,
    });

    await newPost.save();

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error saving post:", error);
    return res.status(500).json({ message: "Failed to create post" });
  }
};


export const viewAllPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post
      .find()
      .populate("author", "email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const count = await Post.countDocuments();

    res.status(200).json({ 
      message: "Posts retrieved successfully", 
      data: posts, 
      totalPages: Math.ceil(count / limit), 
      totalCount: count, 
      page 
    });

  } catch (error) {
    console.error("Error retrieving posts:", error);
    return res.status(500).json({ message: "Failed to retrieve posts" });
  }
}

export const viewMyPosts = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.sub;
  const posts = (await Post.find({ author: userId })) || null;

  if (!posts) {
    return res.status(404).json({ message: "Posts not found" });
  }

  res.status(200).json({ message: "Posts retrieved successfully", posts });
}