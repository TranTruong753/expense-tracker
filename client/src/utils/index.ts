import type { BankAccount, TransactionStatement } from "../types";

// Danh sách ngân hàng phổ biến ở Việt Nam
export const popularBanks: string[] = [
    'Vietcombank',
    'Techcombank',
    'BIDV',
    'Agribank',
    'MB Bank',
    'VPBank',
    'TPBank',
    'ACB',
    'Sacombank',
    'HD Bank',
    'SHB',
    'VietinBank',
    'OCB',
    'MSB',
    'VIB',
    'SeABank',
    'PVcomBank',
    'Bao Viet Bank',
    'Saigon Bank',
    'BAC A BANK',
    'Ngân hàng khác...'
];

export const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 450,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    overflow: 'hidden',
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

export const changeBalanceBank = (id: string, newBank: BankAccount, listBank: BankAccount[] | null, setListBank: (listBank: BankAccount[] | null) => void) => {
    if (!listBank) return;

    const index = listBank.findIndex((item) => item.id === id);
    if (index === -1) return;

    const newList = [...listBank];
    newList.splice(index, 1, newBank);

    setListBank(newList);
};

export const addItemBalanceBank = (newBank: BankAccount, listBank: BankAccount[] | null, setListBank: (listBank: BankAccount[] | null) => void) => {
    if (!listBank) return;
    const newList = [...listBank];
    newList.push(newBank);
    setListBank(newList);
};

export const addItemTransaction = (newTransaction: TransactionStatement, listTransaction: TransactionStatement[] | null, setListTransaction: (listTransaction: TransactionStatement[] | null) => void) => {
    if (!listTransaction) return;
    const newList = [...listTransaction];
    newList.unshift(newTransaction);
    setListTransaction(newList);
}

// Loại bỏ tất cả ký tự không phải số
export const extractNumbers = (value: string): string => {
    return value.replace(/\D/g, '');
};

// chỉ dùng để hiển thị
export const formatNumberWithDots = (value: string): string => {
    if (!value) return '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};


