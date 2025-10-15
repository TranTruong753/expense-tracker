import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Stack,
    FormHelperText,
    InputAdornment
} from '@mui/material';
import { AccountBalanceWallet, AttachMoney } from '@mui/icons-material';
import { useAuth } from "../../hook/useAuth";
import type { BankAccount, ExpenseOrIncomeFormErrors, ModalProps, TransactionInfo } from '../../types';
import { apiCreateTransaction } from '../../services/transactionService';
import { useNotifications } from '@toolpad/core';
import dayjs, { Dayjs } from 'dayjs';
import { addItemTransaction, changeBalanceBank, extractNumbers, formatNumberWithDots, styleModal } from '../../utils';
import { useDeviceType } from '../../hook/useDeviceType';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const IncomeModal = ({ open, onClose }: ModalProps) => {

    const { listBank, listCategories, user, setListBank, listTransaction, setListTransaction } = useAuth()

    const isMobile = useDeviceType('mobile')

    const notifications = useNotifications()

    const [bankData, setBankData] = React.useState<BankAccount | undefined>(undefined);

    const [formData, setFormData] = useState<TransactionInfo>({
        amount: '',
        bankId: '',
        categoryId: '',
        description: '',
        type: 'INCOME',
        transactionDate: ''
    });

    const [errors, setErrors] = useState<ExpenseOrIncomeFormErrors>({});

    const handleChange = (field: keyof TransactionInfo) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => {
        if (field === 'amount') {
            const numericValue = extractNumbers(event.target.value as string);
            setFormData({
                ...formData,
                amount: numericValue
            });
        } else {
            setFormData({
                ...formData,
                [field]: event.target.value
            });
        }
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: ''
            });
        }
    };

    const handleChangeBank = (newValue: string): void => {
        setErrors({
            ...errors,
            bankId: ''
        });
        if (newValue) {
            const data = listBank?.find((bank) => bank.id === newValue)
            setBankData(data)
            setFormData({
                ...formData,
                bankId: newValue,
                transactionDate: data?.initialDate ? dayjs().toISOString() : ''
            });
        }
    }

    const handleSelectDate = (newValue: Dayjs | null) => {
        console.log("newValue", dayjs(newValue).toISOString())
        const value = newValue?.toISOString()
        setFormData({
            ...formData,
            transactionDate: String(value)
        })

        setErrors({
            ...errors,
            transactionDate: ''
        });


        if (!newValue || !dayjs(newValue.format("DD/MM/YYYY"), "DD/MM/YYYY", true).isValid()) {
            return setErrors({
                ...errors,
                transactionDate: 'Thời gian không hợp lệ'
            });
        }



        if (newValue.isBefore(dayjs(bankData?.initialDate), 'day')) {
            return setErrors({
                ...errors,
                transactionDate: 'Thời gian không được nhỏ hơn ngày tạo tài khoản'
            });
        } else if (newValue.isAfter(dayjs(), 'day')) {
            return setErrors({
                ...errors,
                transactionDate: 'Thời gian không được lớn hơn hôm nay'
            });
        }
    }

    const validateForm = (): boolean => {
        const newErrors = { ...errors };

        if (!formData.amount || Number(formData.amount) <= 0) {
            newErrors.amount = 'Số tiền phải lớn hơn 0';
        } else {
            delete newErrors.amount; // nếu hợp lệ thì xóa lỗi cũ
        }

        if (!formData.bankId) {
            console.log("dung lại", formData.bankId);
            newErrors.bankId = 'Vui lòng chọn ngân hàng';
        } else {
            delete newErrors.bankId;
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Vui lòng chọn danh mục';
        } else {
            delete newErrors.categoryId;
        }

        if (errors.transactionDate === '') {
            delete newErrors.transactionDate
        }
        // Cập nhật lỗi (merge cũ + mới)
        setErrors(newErrors);

        // Trả true nếu không còn lỗi nào
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (validateForm()) {
            if (!user) return

            const customFormData = {
                ...formData,
                amount: parseFloat(formData.amount),
                userId: user.id,
                transactionDate: dayjs(formData.transactionDate).toDate()
            }

            try {
                const res = await apiCreateTransaction(customFormData)
                if (res.success) {
                    changeBalanceBank(res.bank.id, res.bank, listBank, setListBank)
                    addItemTransaction(res.data, listTransaction, setListTransaction)
                    handleClose()
                    notifications.show('Thêm mới thu nhập thành công', {
                        severity: "success",
                    });
                }
            } catch {
                return notifications.show('Có lỗi bên phía máy chủ! vui lòng thử lại sau', {
                    severity: "error",
                });
            }

        } 

    };

    const handleClose = () => {
        setFormData({
            amount: '',
            bankId: '',
            categoryId: '',
            description: '',
            type: 'EXPENSE',
            transactionDate: '',
        });
        setBankData(undefined)
        setErrors({});
        onClose();
    };


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="income-modal-title"
            aria-describedby="income-modal-description"
        >
            <Box sx={styleModal} width={isMobile ? '90vw' : 450}>
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: isMobile ? 1.5 : 3,
                        textAlign: 'center',
                        color: 'white'
                    }}
                >

                    <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'center'}>
                        <AccountBalanceWallet sx={{
                            fontSize: isMobile ? 30 : 40,
                            mb: 1
                        }} />
                        <Typography
                            id="income-modal-title"
                            variant="h5"
                            component="h2"
                            fontWeight="bold"
                            fontSize={isMobile ? '1.2rem' : '1.5rem'}
                        >
                            Thêm Mới Thu Nhập
                        </Typography>

                    </Stack>

                </Box>

                {/* Form content */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ p: 3 }}
                >
                    <Stack spacing={2}>
                        {/* Trường số tiền */}
                        <TextField
                            size='small'
                            label="Số Tiền"
                            type="text"
                            value={formatNumberWithDots(formData.amount)}
                            onChange={handleChange('amount')}
                            error={!!errors.amount}
                            helperText={errors.amount ? errors.amount : ' '}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoney color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="0"
                            variant="outlined"
                        />

                        {/* Chọn ngân hàng */}
                        <FormControl fullWidth error={!!errors.bankId} variant="outlined" size='small'>
                            <InputLabel id="bank-select-label">Ngân Hàng</InputLabel>
                            <Select
                                labelId="bank-select-label"
                                value={formData.bankId}
                                label="Ngân Hàng"
                                onChange={(event) => handleChangeBank(event.target.value)}
                            >
                                {listBank && listBank.map((bank) => (
                                    <MenuItem key={bank.id} value={bank.id}>
                                        {bank.bankName} - stk: {bank.accountNumber}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.bankId ? <FormHelperText>{errors.bankId}</FormHelperText> : <Typography component={'span'} height={'20px'}> </Typography>}
                        </FormControl>

                        {/* Chọn danh mục */}
                        <FormControl fullWidth error={!!errors.categoryId} variant="outlined" size='small' margin='none'>
                            <InputLabel id="category-select-label">Danh Mục</InputLabel>
                            <Select

                                labelId="category-select-label"
                                value={formData.categoryId}
                                label="Danh Mục"
                                onChange={handleChange('categoryId')}
                            >
                                {listCategories && listCategories.filter((category) => category.type === 'INCOME').map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {category.icon} {category.name}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.categoryId ? <FormHelperText>{errors.categoryId}</FormHelperText> : <Typography component={'span'} height={'20px'}> </Typography>}
                        </FormControl>

                        {/* Chọn thời gian */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Từ ngày"
                                value={
                                    formData.transactionDate
                                        ? dayjs(formData.transactionDate) // có giá trị -> dùng giá trị đó
                                        : null                    // chưa có -> mặc định ngày hiện tại
                                }
                                onChange={handleSelectDate}
                                maxDate={dayjs()}
                                minDate={bankData?.initialDate ? dayjs(bankData.initialDate) : undefined}
                                format='DD/MM/YYYY'
                                disabled={formData.bankId === '' ? true : false}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                        required: true,
                                        error: !!errors.transactionDate,
                                        helperText: errors.transactionDate ? errors.transactionDate : ' '
                                        ,
                                    }
                                }}

                            />

                        </LocalizationProvider>

                        {/* Mô tả */}
                        <TextField
                            label="Mô Tả"
                            value={formData.description}
                            onChange={handleChange('description')}
                            multiline
                            rows={isMobile ? 2 : 3}
                            fullWidth
                            placeholder="Nhập mô tả cho khoản chi tiêu này..."
                            variant="outlined"
                        />

                        {/* Nút hành động */}
                        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                size={isMobile ? "medium" : "large"}
                                sx={{
                                    borderRadius: 2,
                                    px: isMobile ? 2 : 3,
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size={isMobile ? "medium" : "large"}
                                sx={{
                                    borderRadius: 2,
                                    px: isMobile ? 2 : 3,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                    }
                                }}
                            >
                                💰 Lưu Chi Tiêu
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};

export default IncomeModal;

