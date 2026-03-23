import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import vehicleRoutes from "./src/routes/vehicleRoutes.js";
import dataRoutes from "./src/routes/dataRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

app.use("/vehicle", vehicleRoutes);
app.use("/data", dataRoutes);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
