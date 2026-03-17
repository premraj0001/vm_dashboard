import { fetchHistoryData, exportHistoryDataS3 } from "../services/dataService.js";

export const getPreviewData = async (req, res) => {
  try {
    const { tractorId, startDate, endDate } = req.body;
    if (!tractorId || !startDate || !endDate) return res.status(400).json({ error: "Missing fields" });

    const data = await fetchHistoryData({ tractorId, startDate, endDate });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch preview data" });
  }
};

export const exportFullData = async (req, res) => {
  try {
    const { tractorId, startDate, endDate } = req.body;
    if (!tractorId || !startDate || !endDate) return res.status(400).json({ error: "Missing fields" });

    const result = await exportHistoryDataS3({ tractorId, startDate, endDate });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate export file" });
  }
};