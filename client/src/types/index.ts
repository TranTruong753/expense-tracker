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

export interface FormTouched {
    bankName?: boolean;
    initialBalance?: boolean;
}