import type { TransactionSubmit } from "../types";
import axiosInstance from "./axiosCustom";

export const apiCreateTransaction = async (data: Partial<TransactionSubmit>) => {
    const res = await axiosInstance.post(`/transaction/create`, data);
    return res.data;
};

export interface FormGetStatementByBank {
    fromDate: string,
    toDate: string,
    bankId: string,
}


export const apiGetListTransaction = async () => {
    const res = await axiosInstance.get(`/transaction/get-list`);
    return res.data;
};

export const apiGetStatementByBank = async ({ bankId, fromDate, toDate }: FormGetStatementByBank) => {
    const res = await axiosInstance.get('/transaction/get-statement-by-bank', {
        params: { fromDate, toDate, bankId }
    })
    return res.data;
}