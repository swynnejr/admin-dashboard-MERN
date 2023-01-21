import express from "express";
import { getUser } from "../controllers/general.js";

const router = express.Router();

// When the router hits this enpoint, it calls the getUser function
router.get("/user/:id", getUser);

export default router;
