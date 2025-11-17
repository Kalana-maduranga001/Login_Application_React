import { Router } from "express";
import { register, login, getMyDetails, registerAdmin, handleRefreshToken } from "../controllers/authController";
import { authenticate, isAdmin } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh" , handleRefreshToken);
router.get("/me", authenticate, getMyDetails);
router.post("/admin/register", authenticate, isAdmin, registerAdmin);

export default router;