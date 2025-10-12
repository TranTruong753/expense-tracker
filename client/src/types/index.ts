import type { ReactNode } from "react";

// Định nghĩa types
// {Statement Page}
export interface SummaryStatement {
    startBalance: number,
    totalIncome: number,
    totalExpense: number,
    endBalance: number,
}

export interface StatementIf {
    summary: SummaryStatement,
    transactions: TransactionStatement[]
}

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
    listTransaction: Transaction[] | null
    setListTransaction: (listTransaction: Transaction[] | null) => void
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
    type?: string
}

