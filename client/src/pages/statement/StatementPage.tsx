import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Container,
    Divider,
    Stack,
    FormControl,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Search,
    TrendingUp,
    TrendingDown,
    Receipt,
    Delete
} from '@mui/icons-material';
import type { Dayjs } from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import type { BankAccount, StatementTableIf } from '../../types';
import { apiGetStatementByBank } from '../../services/transactionService';
import { formatCurrency } from '../../utils';
import { useNotifications } from '@toolpad/core';
import { useDeviceType } from '../../hook/useDeviceType';
import { useAuth } from '../../hook/useAuth';
import TableStatement from '../../components/statement/TableStatement';



const StatementPage = () => {
    const [statementDataTableObj, setStatementDataTableObj] = React.useState<Partial<StatementTableIf>>()
    const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
    const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
    const [startError, setStartError] = React.useState('');
    const [endError, setEndError] = React.useState('');
    const [bankError, setBankError] = React.useState('');
    const [bankData, setBankData] = React.useState<BankAccount | undefined>(undefined);
    const [bankId, setBankId] = React.useState<string>('');

    const { listBank } = useAuth()

    const notifications = useNotifications()

    const isMobile = useDeviceType('mobile')

    const isTablet = useDeviceType('tablet')

    const handleSelectChange = (newValue: string): void => {
        handleReset()
        setBankId(newValue)
        setBankError('')
        if (newValue) {
            const data = listBank?.find((bank) => bank.id === newValue)
            setBankData(data)
            setStartDate(dayjs(data?.initialDate))
        }
    }

    const handleStartDateChange = (newValue: Dayjs | null) => {

        setStartError('');
        setStartDate(newValue);

        if (!newValue || !dayjs(newValue.format("DD/MM/YYYY"), "DD/MM/YYYY", true).isValid()) return setStartError('Thời gian không hợp lệ');


        if (newValue.isBefore(dayjs(bankData?.initialDate), 'day')) {
            return setStartError('Thời gian không được nhỏ hơn ngày tạo tài khoản');
        } else if (newValue.isAfter(dayjs(), 'day')) {
            return setStartError('Thời gian không được lớn hơn hôm nay');
        }

    };

    const handleEndDateChange = (newValue: Dayjs | null) => {
        setEndError('');
        setEndDate(newValue);

        if (!newValue || !dayjs(newValue.format("DD/MM/YYYY"), "DD/MM/YYYY", true).isValid()) return setEndError('Thời gian không hợp lệ');


        if (newValue.isAfter(dayjs(), 'day')) {
            return setEndError('Thời gian không được lớn hơn hôm nay');
        } else if (startDate && newValue.isBefore(startDate, 'day')) {
            return setEndError('Thời gian không được nhỏ hơn ngày bắt đầu');
        }
    };


    const handleReset = () => {
        setStatementDataTableObj({})
        setBankData(undefined)
        setBankId('')
        setEndDate(null)
        setStartDate(null)
        setEndError('')
        setStartError('')
    }

    const isValidate = () => {
        if (!bankData || bankId === '') {
            notifications.show('Bạn chưa chọn tài khoản ngân hàng!', {
                severity: 'error'
            })
            return false
        }
        if (!startDate || !endDate) {
            notifications.show('Bạn chưa nhập ngày bắt đầu hoặc ngày kết thúc!', {
                severity: 'error'
            })
            return false
        }
        else if (startError || endError) return false
        return true
    }

    const handleSearch = async () => {
        if (!isValidate()) return

        try {
            const fromDate = dayjs(startDate).format('YYYY-MM-DD');
            const toDate = dayjs(endDate).format('YYYY-MM-DD');
            const res = await apiGetStatementByBank({ fromDate, toDate, bankId })

            setStatementDataTableObj(res.data)

        } catch {
            notifications.show('Lỗi máy chủ ! vui lòng thử lại sau', {
                severity: 'error'
            })
        }

    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>

            <Stack direction='column' alignItems={'start'} spacing={1} sx={{ mb: 2 }}>
                <Stack direction='row' alignItems={'center'} >
                    <ReceiptLongIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography
                        variant="h6"
                        color="primary.main"
                        fontWeight={600}
                        fontSize={isMobile ? '1.2rem' : '1.25rem'}
                    >
                        SAO KÊ
                    </Typography>

                </Stack>
                <Typography variant="body1" color="text.secondary">
                    Theo dõi thu chi và biến động tài khoản
                </Typography>
            </Stack>

            {/* Bộ lọc thời gian */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <FormControl fullWidth size='small'>
                        <Stack direction={'column'} alignItems={isMobile ? 'center' : 'start'}>
                            <Select
                                value={bankId}
                                onChange={(event) => handleSelectChange(event.target.value)}
                                displayEmpty
                                error={!!bankError}
                                fullWidth
                                sx={{
                                    width: 300,
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
                                {listBank?.map((bank) => (
                                    <MenuItem key={bank.id} value={bank.id}>
                                        {bank.bankName} - stk: {bank.accountNumber}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Stack>
                    </FormControl>
                    {bankError ? (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {bankError}
                        </Typography>
                    ) : <Typography variant="caption" color="error" height={'20px'} sx={{ mt: 0.5, display: 'block' }}></Typography>}

                    <Divider sx={{ mb: 2 }} />

                    <Stack direction={(isMobile || isTablet) ? 'column' : 'row'} justifyContent={'start'} alignItems={isMobile ? 'center' : 'start'} spacing={(isMobile || isTablet) ? 3 : 2} >


                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 3 : 2} justifyContent={'space-between'}
                            >
                                <DatePicker
                                    label="Từ ngày"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    maxDate={endDate ? endDate : dayjs()}
                                    minDate={bankData?.initialDate ? dayjs(bankData.initialDate) : undefined}
                                    format='DD/MM/YYYY'
                                    disabled={bankId === '' ? true : false}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            required: true,
                                            error: !!startError,
                                            helperText: startError ? startError : ' ',
                                            sx: { width: isTablet ? 250 : 300 },
                                        }
                                    }}

                                />
                                <DatePicker
                                    label="Đến ngày"
                                    value={endDate}
                                    minDate={startDate ? startDate : undefined} // không cho chọn nhỏ hơn ngày bắt đầu
                                    onChange={handleEndDateChange}
                                    maxDate={dayjs()}
                                    disabled={bankId === '' ? true : false}
                                    format='DD/MM/YYYY'
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            required: true,
                                            error: !!endError,
                                            helperText: endError ? endError : ' ',
                                            sx: { width: isTablet ? 250 : 300 },
                                        }
                                    }}
                                />
                            </Stack>
                        </LocalizationProvider>


                        <Stack direction={'row'} spacing={1} sx={{}}>
                            <Button
                                variant="contained"
                                startIcon={<Search />}
                                onClick={handleSearch}

                                sx={{
                                    py: 1.5,
                                    textTransform: 'none',
                                    height: '40px'
                                }}
                            >
                                Tìm kiếm
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<Delete />}
                                onClick={handleReset}
                                sx={{
                                    py: 1.5,
                                    textTransform: 'none',
                                    height: '40px'
                                }}
                                color='error'
                            >
                                Xóa dữ liệu
                            </Button>
                        </Stack>

                    </Stack>

                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {/* Phần tổng hợp */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    fontSize={isMobile ? '1.2rem' : '1.25rem'}
                                >
                                    TỔNG HỢP
                                </Typography>
                            </Box>

                            {/* Số dư đầu kỳ */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Số dư đầu kỳ:
                                </Typography>
                                <Typography variant="h6" color="primary" fontWeight="bold" height={'20px'} fontSize={'1.5rem'}>
                                    {statementDataTableObj?.openingBalance ? formatCurrency(Number(statementDataTableObj?.openingBalance)) : ' '}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Tổng thu */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TrendingUp sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
                                    <Typography variant="body1">Tổng thu:</Typography>
                                </Box>
                                <Typography variant="h6" color="success.main" fontWeight="bold">
                                    {statementDataTableObj?.totalIncome ? `+ ${formatCurrency(Number(statementDataTableObj.totalIncome))}` : ' '}
                                </Typography>
                            </Box>

                            {/* Tổng chi */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TrendingDown sx={{ mr: 1, color: 'error.main', fontSize: 20 }} />
                                    <Typography variant="body1">Tổng chi:</Typography>
                                </Box>
                                <Typography variant="h6" color="error.main" fontWeight="bold">
                                    {statementDataTableObj?.totalExpense ? `- ${formatCurrency(Number(statementDataTableObj.totalExpense))}` : ' '}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Số dư cuối kỳ */}
                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Số dư cuối kỳ:
                                </Typography>
                                <Typography variant="h6" color="primary" fontWeight="bold" fontSize={'1.5rem'}>
                                    {statementDataTableObj?.closingBalance ? formatCurrency(Number(statementDataTableObj?.closingBalance)) : ' '}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Phần chi tiết giao dịch */}
                <Grid size={{ xs: 12, sm: 8 }}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" fontWeight="bold">
                                    CHI TIẾT GIAO DỊCH
                                </Typography>
                            </Box>

                            <TableStatement data={statementDataTableObj} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StatementPage;