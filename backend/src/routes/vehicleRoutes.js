import express from "express";
import { getVehicle } from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/", getVehicle);

export default router;
