import axios from "axios";
import axiosInstance from "./axiosCustom";
import type { FormDataRegister } from "../types";



const API_URL = import.meta.env.VITE_API_URL as string;

export const apiGoogleLogin = async (idToken: string) => {
  const res = await axios.post(`${API_URL}/auth/login`, { idToken });
  return res.data
};

export const apiRegister = async (data: Partial<FormDataRegister>) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data
}

export const apiGetProfile = async () => {
   const res = await axiosInstance.get(`/auth/profile`)
   return res.data
}

export const apiCheckToken = async () => {
  const res = await axiosInstance.get('/auth/check-token')
  return res.data
}