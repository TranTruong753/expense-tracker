import type { FormDataCreateNewBank } from "../types";
import axiosInstance from "./axiosCustom";

export const apiGetAllBankByUserId = async (userId: string) => {
    const res = await axiosInstance.get(`/bank-account/get-all-bank/${userId}`);
    return res.data;
};

export const apiCreateBank = async (data: Partial<FormDataCreateNewBank>) => {
    const res = await axiosInstance.post(`/bank-account/create`,data)
    return res.data
}