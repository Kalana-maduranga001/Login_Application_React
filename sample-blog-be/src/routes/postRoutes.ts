import { Router } from "express";
import { savePost, viewAllPosts, viewMyPosts } from "../controllers/postController";
import { authenticate, isAdminOrAuthor } from "../middleware/auth";
import upload from "../middleware/upload";

const router = Router();

router.post("/save", authenticate, isAdminOrAuthor, upload.single("image"), savePost);
router.get("/", viewAllPosts);
router.get("/me", authenticate, isAdminOrAuthor, viewMyPosts);

export default router;