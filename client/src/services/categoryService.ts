import axiosInstance from "./axiosCustom";

export const apiGetAllCategory = async () => {
    const res = await axiosInstance.get(`/categories`);
    return res.data;
};