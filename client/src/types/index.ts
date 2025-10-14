import type { ReactNode } from "react";

// Định nghĩa types

export interface BankInfo {
    bankName: string;
    initialBalance: string;
    accountNumber: string;
}

export interface FormErrors {
    bankName?: string;
    initialBalance?: string;
    accountNumber?: string
}


export interface AuthProviderProps {
    children: ReactNode;
}

export interface BankAccount {
    id: string,
    bankName: string,
    accountNumber: string,
    balance: number,
    initialBalance: number,
    createdAt?: Date,
}

export interface Category {
    id: string;
    name: string;
    type: string,
    icon: string,
    isDefault: boolean,
}

export interface Transaction {
    id: string,
    amount: number;
    bankId: string;
    type: string;
    categoryId: string;
    description: string;
    transactionDate: Date
}

export interface TransactionCustom {
    date: string;
    description: string;
    opening: number;
    moneyIn: number;
    moneyOut: number;
    closing: number;
    category: string;
    categoryIcon: string;
}

export interface StatementTableIf {
    bank: BankAccount,
    fromDate: string,
    toDate: string,
    totalExpense: number,
    totalIncome: number,
    openingBalance: number,
    closingBalance: number,
    transactions: TransactionCustom[]
}

export interface TransactionStatement extends Transaction {
    id: string
    bank: string,
    category: string,
    categoryIcon: string,
}

export interface TransactionSubmit extends Transaction {
    userId: string
}
export interface TransactionInfo {
    amount: string;
    bankId: string;
    type: string;
    categoryId: string;
    description: string;
    transactionDate: string;
}
export interface FormDataRegister extends BankAccount {
    userId: string,
}

export interface FormDataCreateNewBank extends BankAccount {
    userId: string,
}

export interface AuthContextType {
    user: ProfileResponse | null;
    setUser: (user: ProfileResponse | null) => void;
    listBank: BankAccount[] | null;
    setListBank: (listBank: BankAccount[] | null) => void;
    loadingPage: boolean;
    setLoadingPage: (loadingPage: boolean) => void;
    listCategories: Category[] | null
    setListCategories: (listCategories: Category[] | null) => void
    listTransaction: TransactionStatement[] | null
    setListTransaction: (listTransaction: TransactionStatement[] | null) => void
}

export interface ProfileResponse {
    id: string,
    name: string,
    email: string,
    avatar: string,
}

export interface UserData extends ProfileResponse {
    bankAccounts: BankAccount[],
    totalBalance: number
}

//{Modal}
export interface ModalProps {
    open: boolean;
    onClose: () => void;
}

export interface ExpenseOrIncomeFormErrors {
    amount?: string;
    bankId?: string;
    categoryId?: string;
    description?: string;
    type?: string;
    transactionDate?: string
}

