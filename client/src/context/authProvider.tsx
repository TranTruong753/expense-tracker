import React from "react";
import type { AuthProviderProps, BankAccount, Category, ProfileResponse, Transaction } from "../types";
import { AuthContext } from "./authContext";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [user, setUser] = React.useState<ProfileResponse | null>(null);

    const [listBank, setListBank] = React.useState<BankAccount[] | null>(null);

    const [listCategories, setListCategories] = React.useState<Category[] | null>(null);

    const [listTransaction, setListTransaction] = React.useState<Transaction[] | null>(null)

    const [loadingPage, setLoadingPage] = React.useState<boolean>(true)

    const value = {
        user,
        setUser,
        listBank,
        setListBank,
        loadingPage,
        setLoadingPage,
        listCategories,
        setListCategories,
        listTransaction,
        setListTransaction,
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
}