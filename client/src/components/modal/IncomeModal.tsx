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
import type { ExpenseOrIncomeFormErrors, ModalProps, TransactionInfo } from '../../types';
import { apiCreateTransaction } from '../../services/transactionService';
import { useNotifications } from '@toolpad/core';
import dayjs from 'dayjs';
import { addItemTransaction, changeBalanceBank, styleModal } from '../../utils';

const IncomeModal = ({ open, onClose }: ModalProps) => {

    const { listBank, listCategories, user, setListBank, listTransaction, setListTransaction } = useAuth()

    const notifications = useNotifications()

    const [formData, setFormData] = useState<TransactionInfo>({
        amount: '',
        bankId: '',
        categoryId: '',
        description: '',
        type: 'INCOME'
    });

    const [errors, setErrors] = useState<ExpenseOrIncomeFormErrors>({});

    const handleChange = (field: keyof TransactionInfo) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: ''
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ExpenseOrIncomeFormErrors = {};

        if (!formData.amount || Number(formData.amount) <= 0) {
            newErrors.amount = 'Số tiền phải lớn hơn 0';
        }

        if (!formData.bankId) {
            newErrors.bankId = 'Vui lòng chọn ngân hàng';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Vui lòng chọn danh mục';
        }

        setErrors(newErrors);
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
                transactionDate: dayjs().toDate()
            }
            console.log('Dữ liệu thu nhập:', customFormData);

            try {
                const res = await apiCreateTransaction(customFormData)
                console.log(res)
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
            type: 'INCOME'
        });
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
            <Box sx={styleModal}>
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: 3,
                        textAlign: 'center',
                        color: 'white'
                    }}
                >

                    <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'center'}>
                        <AccountBalanceWallet sx={{ fontSize: 40, mb: 1 }} />
                        <Typography
                            id="income-modal-title"
                            variant="h5"
                            component="h2"
                            fontWeight="bold"
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
                            type="number"
                            value={formData.amount}
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
                                onChange={handleChange('bankId')}
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

                        {/* Mô tả */}
                        <TextField
                            label="Mô Tả"
                            value={formData.description}
                            onChange={handleChange('description')}
                            multiline
                            rows={3}
                            fullWidth
                            placeholder="Nhập mô tả cho khoản chi tiêu này..."
                            variant="outlined"
                        />

                        {/* Nút hành động */}
                        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                size="large"
                                sx={{
                                    borderRadius: 2,
                                    px: 3
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
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

