import axios from "axios";

interface FormDataRegister {
  userId: string,
  bankName: string,
  accountNumber: string,
  balance: number,
  initialBalance: number,
}

const API_URL = import.meta.env.VITE_API_URL as string;

export const handleGoogleLogin = async (idToken: string) => {
  const res = await axios.post(`${API_URL}/auth/login`, { idToken });
  return res.data
};

export const handleRegister = async (data: Partial<FormDataRegister>) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data
}