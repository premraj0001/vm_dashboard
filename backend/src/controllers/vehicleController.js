import { latestVehicleData, ensureSSEConnection } from "../services/sseService.js";

export const getVehicle = (req, res) => {
  try {
    const { tractorId } = req.query;

    if (!tractorId) {
      return res.status(400).json({ error: "tractorId is required" });
    }

    ensureSSEConnection(tractorId);

    const data = latestVehicleData[tractorId];

    return res.status(200).json([data || {}]);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch vehicle data" });
  }
};