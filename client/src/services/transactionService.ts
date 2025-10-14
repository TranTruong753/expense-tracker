import type { TransactionSubmit } from "../types";
import axiosInstance from "./axiosCustom";

export const apiCreateTransaction = async (data: Partial<TransactionSubmit>) => {
    const res = await axiosInstance.post(`/transaction/create`, data);
    return res.data;
};

export interface FromDateToDate {
    fromDate: string,
    toDate: string
}

export interface FormGetStatementByBank extends FromDateToDate {
    bankId: string,
}

export const apiGetStatement = async ({ fromDate, toDate }: FromDateToDate) => {
    const res = await axiosInstance.get(`/transaction/get-statement`, {
        params: { fromDate, toDate }
    });
    return res.data;
};

export const apiGetListTransaction = async () => {
    const res = await axiosInstance.get(`/transaction/get-list`);
    return res.data;
};

export const apiGetListTransactionFromDayToDay = async ({ fromDate, toDate }: FromDateToDate) => {
    const res = await axiosInstance.get(`/transaction/get-list-from-to`, {
        params: { fromDate, toDate }
    });
    return res.data;
};

export const apiGetStatementByBank = async ({ bankId, fromDate, toDate }: FormGetStatementByBank) => {
    const res = await axiosInstance.get('/transaction/get-statement-by-bank', {
        params: { fromDate, toDate, bankId }
    })
    return res.data;
}