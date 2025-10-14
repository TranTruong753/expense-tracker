import { Box, Button, FormControl, InputAdornment, MenuItem, Modal, Select, Stack, TextField, Typography, type SelectChangeEvent } from "@mui/material";
import { addItemBalanceBank, extractNumbers, formatNumberWithDots, popularBanks, styleModal } from "../../utils";
import React from "react";
import type { BankInfo, FormErrors, ModalProps } from "../../types";
import { useNotifications } from "@toolpad/core";
import type { AxiosError } from "axios";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { apiCreateBank } from "../../services/bankAccountService";
import { useAuth } from "../../hook/useAuth";
import { useDeviceType } from "../../hook/useDeviceType";

function CreateBankAccount({ open, onClose }: ModalProps) {

    const { user, listBank, setListBank } = useAuth()

    const isMobile = useDeviceType('mobile')

    const notifications = useNotifications()

    const [bankInfo, setBankInfo] = React.useState<BankInfo>({
        bankName: '',
        initialBalance: '',
        accountNumber: ''
    });

    const [errors, setErrors] = React.useState<FormErrors>({});

    const handleClose = () => {
        setBankInfo({
            bankName: '',
            initialBalance: '',
            accountNumber: ''
        });
        setErrors({});
        onClose();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        if (name === "initialBalance") {
            const numericValue = extractNumbers(value);
            setBankInfo(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else {
            setBankInfo(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<string>): void => {
        const { name, value } = e.target;
        setBankInfo(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };


    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!bankInfo.bankName.trim()) {
            newErrors.bankName = 'Vui lòng nhập tên ngân hàng';
        }

        if (!bankInfo.accountNumber.trim()) {
            newErrors.accountNumber = 'Vui lòng nhập số tài khoản';
        } else if (!/^\d+$/.test(bankInfo.accountNumber)) {
            newErrors.accountNumber = 'Số tài khoản chỉ được chứa chữ số';
        }
        else if (bankInfo.accountNumber.length < 8 || bankInfo.accountNumber.length > 14) {
            newErrors.accountNumber = 'Số tài khoản phải từ 8–14 chữ số';
        }
        if (!bankInfo.initialBalance) {
            newErrors.initialBalance = 'Vui lòng nhập số dư ban đầu';
        } else if (parseFloat(bankInfo.initialBalance) < 0) {
            newErrors.initialBalance = 'Số dư không thể âm';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        if (validateForm()) {
            const id = user?.id

            if (!id) return notifications.show('Lỗi tại tài khoản! vui lòng quay lại trang đăng nhập!', {
                severity: "error",
            });

            const initialBalanceConvertFloat = parseFloat(bankInfo.initialBalance)

            const formSubmit = {
                ...bankInfo,
                userId: id,
                initialBalance: initialBalanceConvertFloat,
                balance: initialBalanceConvertFloat,
            }

            try {
                const res = await apiCreateBank(formSubmit)
                if (res.success) {
                    notifications.show('Thêm tài khoản ngân hành thành công!', {
                        severity: "success",
                    });
                    addItemBalanceBank(res.bank, listBank, setListBank)
                    handleClose()
                }


            } catch (error) {
                const err = error as AxiosError
                if (err.response?.status === 409) {
                    const newErrors: FormErrors = {};
                    newErrors.accountNumber = 'số tài khoản đã được sử dụng hoặc không hợp lệ!';
                    setErrors(newErrors);
                    return notifications.show('số tài khoản đã được sử dụng hoặc không hợp lệ!', { severity: 'error' })
                }

                return notifications.show('Có lỗi bên phía máy chủ! vui lòng thử lại sau', {
                    severity: "error",
                });
            }



        }
    };

    const hasError = (field: keyof FormErrors): boolean => {
        return !!errors[field];
    };


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="expense-modal-title"
            aria-describedby="expense-modal-description"
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
                        <AccountBalanceIcon sx={{
                            fontSize: isMobile ? 30 : 40,
                            mb: 1
                        }} />
                        <Typography
                            id="expense-modal-title"
                            variant="h5"
                            component="h2"
                            fontWeight="bold"
                            fontSize={isMobile ? '1.2rem' : '1.5rem'}
                        >
                            Thêm ví mới
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
                        {/* Tên ngân hàng với dropdown */}
                        <Box>
                            <FormControl fullWidth>
                                <Select
                                    name="bankName"
                                    size='small'
                                    value={bankInfo.bankName}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    error={hasError('bankName')}
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: '#fafafa',
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#667eea',
                                        },
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Chọn ngân hàng</em>
                                    </MenuItem>
                                    {popularBanks.map((bank) => (
                                        <MenuItem key={bank} value={bank}>
                                            {bank}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {hasError('bankName') ? (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                    {errors.bankName}
                                </Typography>
                            ) : <Typography variant="caption" color="error" height={'20px'} sx={{ mt: 0.5, display: 'block' }}></Typography>}
                        </Box>

                        {/* Số tài khoản */}
                        <Box>
                            <TextField
                                fullWidth
                                label='Số tài khoản'
                                size='small'
                                variant="outlined"
                                name="accountNumber"
                                value={bankInfo.accountNumber}
                                onChange={handleInputChange}
                                placeholder="1234xxxx"
                                error={hasError('accountNumber')}

                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: '#fafafa',
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    }
                                }}
                            />
                            {hasError('accountNumber') ? (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                    {errors.accountNumber}
                                </Typography>
                            ) : <Typography variant="caption" color="error" height={'20px'} sx={{ mt: 0.5, display: 'block' }}></Typography>}
                        </Box>

                        {/* Số dư ban đầu */}
                        <Box>

                            <TextField
                                fullWidth
                                size='small'
                                label='Số dư ban đầu'
                                variant="outlined"
                                name="initialBalance"
                                value={formatNumberWithDots(bankInfo.initialBalance)}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="0"
                                error={hasError('initialBalance')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography variant="body2" color="text.secondary">
                                                ₫
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: '#fafafa',
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    }
                                }}
                            />
                            {hasError('initialBalance') ? (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                    {errors.initialBalance}
                                </Typography>
                            ) : <Typography variant="caption" color="error" height={'20px'} sx={{ mt: 0.5, display: 'block' }}></Typography>}
                        </Box>

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
                                💰 Tạo ví mới
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateBankAccount;