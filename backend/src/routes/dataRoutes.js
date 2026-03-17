import express from "express";
import { getPreviewData, exportFullData } from "../controllers/dataController.js";

const router = express.Router();

router.post("/", getPreviewData); 
router.post("/export", exportFullData); 

export default router;