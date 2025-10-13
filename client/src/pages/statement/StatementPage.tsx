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
    List,
    Stack
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
import type { StatementIf } from '../../types';
import { apiGetListTransactionFromDayToDay, apiGetStatement } from '../../services/transactionService';
import { formatCurrency } from '../../utils';
import TransactionCard from '../../components/transaction/TransactionCard';
import { useNotifications } from '@toolpad/core';


const StatementPage = () => {
    const [statementDataObj, setStatementDataObj] = React.useState<Partial<StatementIf>>()
    const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
    const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

    const notifications = useNotifications()

    const [startError, setStartError] = React.useState('');
    const [endError, setEndError] = React.useState('');

    const handleStartDateChange = (newValue: Dayjs | null) => {
        setStartDate(newValue);

        if (newValue && newValue.isAfter(dayjs(), 'day')) {
            setStartError('Ngày bắt đầu không được lớn hơn hôm nay');
        } else {
            setStartError('');
            // kiểm tra lại endDate nếu đã chọn
            if (endDate && newValue && endDate.isBefore(newValue, 'day')) {
                setEndError('Ngày kết thúc không được nhỏ hơn ngày bắt đầu');
            } else {
                setEndError('');
            }
        }
    };

    const handleEndDateChange = (newValue: Dayjs | null) => {
        setEndDate(newValue);

        if (newValue) {
            if (newValue.isAfter(dayjs(), 'day')) {
                setEndError('Ngày kết thúc không được lớn hơn hôm nay');
            } else if (startDate && newValue.isBefore(startDate, 'day')) {
                setEndError('Ngày kết thúc không được nhỏ hơn ngày bắt đầu');
            }
        }
        else {
            setEndError('');
        }
    };


    const handleReset = () => {
        setStatementDataObj({})
        setEndDate(null)
        setStartDate(null)
        setEndError('')
        setStartError('')
    }

    const isValidate = () => {
        if (!startDate || !endDate) {
            notifications.show('Bạn chưa nhập ngày bắt đầu và ngày kết thúc!', {
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

            const [statementRes, transactionRes] = await Promise.all([
                apiGetStatement({ fromDate, toDate }),
                apiGetListTransactionFromDayToDay({ fromDate, toDate }),
            ]);

            setStatementDataObj({
                summary: statementRes.data,
                transactions: transactionRes.data
            })

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
                    <Typography variant="h6" color="primary.main" fontWeight={600}>
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
                    <Stack direction={'row'} justifyContent={'start'} alignItems={'start'} spacing={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack direction="row" spacing={3} justifyContent={'space-between'} >
                                <DatePicker
                                    label="Từ ngày"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    maxDate={dayjs()}
                                    format='DD/MM/YYYY'
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            required: true,
                                            error: !!startError,
                                            helperText: startError ? startError : ' ',
                                            sx: { width: 300 },
                                        }
                                    }}

                                />
                                <DatePicker
                                    label="Đến ngày"
                                    value={endDate}
                                    minDate={startDate ? startDate : undefined} // không cho chọn nhỏ hơn ngày bắt đầu
                                    onChange={handleEndDateChange}
                                    maxDate={dayjs()}
                                    format='DD/MM/YYYY'
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            required: true,
                                            error: !!endError,
                                            helperText: endError ? endError : ' ',
                                            sx: { width: 300 },
                                        }
                                    }}
                                />
                            </Stack>
                        </LocalizationProvider>


                        <Stack direction={'row'} spacing={1}>
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
                                <Typography variant="h6" fontWeight="bold">
                                    TỔNG HỢP
                                </Typography>
                            </Box>

                            {/* Số dư đầu kỳ */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Số dư đầu kỳ:
                                </Typography>
                                <Typography variant="h6" color="primary" fontWeight="bold" height={'20px'}>
                                    {statementDataObj?.summary ? formatCurrency(Number(statementDataObj?.summary?.startBalance)) : ' '}
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
                                    {statementDataObj?.summary ? `+ ${formatCurrency(Number(statementDataObj?.summary?.totalIncome))}` : ' '}
                                </Typography>
                            </Box>

                            {/* Tổng chi */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TrendingDown sx={{ mr: 1, color: 'error.main', fontSize: 20 }} />
                                    <Typography variant="body1">Tổng chi:</Typography>
                                </Box>
                                <Typography variant="h6" color="error.main" fontWeight="bold">
                                    {statementDataObj?.summary ? `- ${formatCurrency(Number(statementDataObj?.summary?.totalExpense))}` : ' '}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Số dư cuối kỳ */}
                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Số dư cuối kỳ:
                                </Typography>
                                <Typography variant="h5" color="primary" fontWeight="bold">
                                    {statementDataObj?.summary ? ` ${formatCurrency(Number(statementDataObj?.summary?.endBalance))}` : ' '}
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

                            {(statementDataObj?.transactions && statementDataObj.transactions?.length > 0) ?
                                (<List sx={{ width: '100%', height: '40vh', overflowY: 'auto' }}>
                                    {statementDataObj?.transactions?.map((transaction) => (
                                        <TransactionCard transaction={transaction} />
                                    ))}
                                </List>) :
                                <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} height={'40vh'} >
                                    <Typography component={'span'} fontSize={'18px'}>Bạn chưa có giao dịch nào</Typography>
                                </Stack>
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StatementPage;