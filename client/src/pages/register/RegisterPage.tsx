import React, { useState } from 'react';
import {
    Box,
    Card,
    Container,
    Stack,
    Typography,
    TextField,
    Button,
    InputAdornment,
    MenuItem,
    FormControl,
    Select,
    type SelectChangeEvent
} from "@mui/material";
import AddCardIcon from '@mui/icons-material/AddCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { extractNumbers, formatNumberWithDots, popularBanks } from '../../utils';
import type { BankInfo, FormErrors } from '../../types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotifications } from '@toolpad/core';
import { apiRegister } from '../../services/authService';
import type { AxiosError } from 'axios';
import { useDeviceType } from '../../hook/useDeviceType';



function RegisterPage() {
    const [bankInfo, setBankInfo] = useState<BankInfo>({
        bankName: '',
        initialBalance: '',
        accountNumber: ''
    });

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const notifications = useNotifications()

    const [errors, setErrors] = useState<FormErrors>({});

    const isMobile = useDeviceType('mobile')

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
            const id = searchParams.get("id");

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

                const { redirectTo } = await apiRegister(formSubmit)
                navigate(redirectTo)
                setBankInfo({
                    bankName: '',
                    initialBalance: '',
                    accountNumber: ''
                });

            } catch (error) {
                const err = error as AxiosError
                if (err.response?.status === 409) {
                    const newErrors: FormErrors = {};
                    newErrors.accountNumber = 'số tài khoản đã tồn tại hoặc không hợp lệ!';
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
        <Box
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <Container maxWidth='xl'
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4
                }}>
                <Card
                    variant="outlined"
                    sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        width: 450,
                        maxWidth: '90vw',
                        px: isMobile ? 3 : 4,
                        py: isMobile ? 3 : 4,
                        borderRadius: 3,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}
                >
                    <Stack
                        direction={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        spacing={isMobile ? 2 : 3}
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {/* Logo/Icon Section */}
                        <Box
                            sx={{
                                width: isMobile ? 60 : 80,
                                height: isMobile ? 60 : 80,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2
                            }}
                        >
                            <AccountBalanceIcon fontSize={isMobile ? "medium" : "large"} sx={{ color: 'white' }} />
                        </Box>

                        {/* Title Section */}
                        <Stack direction={'column'} alignItems={'center'} spacing={isMobile ? 1.5 : 2}>
                            <Typography
                                variant="h1"
                                fontSize={isMobile ? '1.4rem' : '1.7rem'}
                                fontWeight={700}
                                color="#333"
                                textAlign={'center'}
                            >
                                TÀI KHOẢN NGÂN HÀNG
                            </Typography>
                            <Typography
                                variant="h2"
                                fontSize={isMobile ? '0.9rem' : '1rem'}
                                color="#666"
                                textAlign={'center'}
                            >
                                Thêm tài khoản ngân hàng đầu tiên của bạn
                            </Typography>
                        </Stack>

                        {/* Divider */}
                        <Box
                            sx={{
                                width: '100%',
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, #ddd, transparent)',
                                my: 1
                            }}
                        />

                        {/* Form Section */}
                        <Stack direction={'column'} spacing={1} width={'100%'}>

                            {/* Tên ngân hàng với dropdown */}
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1, fontWeight: 500 }}
                                >
                                    Tên ngân hàng:
                                </Typography>
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
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1, fontWeight: 500 }}
                                >
                                    Số tài khoản:
                                </Typography>
                                <TextField
                                    fullWidth
                                    size='small'
                                    variant="outlined"
                                    name="accountNumber"
                                    value={bankInfo.accountNumber}
                                    onChange={handleInputChange}
                                    placeholder="xxxx"
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
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1, fontWeight: 500 }}
                                >
                                    Số dư ban đầu:
                                </Typography>
                                <TextField
                                    fullWidth
                                    size='small'
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

                            {/* Nút thêm tài khoản */}
                            <Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    startIcon={<AddCardIcon fontSize='large' />}
                                    sx={{
                                        py: isMobile ? 1.2 : 1.5,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        fontWeight: 'bold',
                                        fontSize: isMobile ? '1rem' :'1.1rem',
                                        textTransform: 'none',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                                            transform: 'translateY(-1px)'
                                        },
                                        transition: 'all 0.3s ease',
                                        mt: 1
                                    }}
                                >
                                    THÊM TÀI KHOẢN
                                </Button>
                            </Box>
                        </Stack>
                    </Stack>
                </Card>
            </Container>
        </Box>
    );
}

export default RegisterPage;