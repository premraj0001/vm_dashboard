
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const fetchData = (payload) => {
  return axios.post(`${API}/data`, payload);
};

export const fetchHistory = (payload) => {
  return axios.post(`${API}/history`, payload);
};

export const fetchVehicle = (tractorId) => {
  return axios.get(`${API}/vehicle`, {
    params: { tractorId },
  });
};