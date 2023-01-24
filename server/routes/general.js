import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";

const router = express.Router();

// When the router hits this enpoint, it calls the getUser function
router.get("/user/:id", getUser);
router.get("/dashboard", getDashboardStats);

export default router;
