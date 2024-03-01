import express, { Router } from "express";
import { getUserByUserName } from "../Controllers/UserController.js";

const router: Router = express.Router();

router.get("/:username", getUserByUserName);

export default router;
