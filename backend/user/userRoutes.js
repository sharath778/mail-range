import express from "express";
import { createUser, loginUser, getUserById } from "./userController.js";
import authMiddleware from "../middlwares/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/", authMiddleware, getUserById);

export default router;
