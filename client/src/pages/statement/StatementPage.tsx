import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Grid,
    Container,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    useTheme,
    useMediaQuery,
    Stack
} from '@mui/material';
import {
    Search,
    TrendingUp,
    TrendingDown,
    AccountBalance,
    Receipt,
    DateRange
} from '@mui/icons-material';

const StatementPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [filters, setFilters] = useState({
        startDate: '2023-11-01',
        endDate: '2023-11-30'
    });

    // Dữ liệu mẫu
    const statementData = {
        summary: {
            openingBalance: 20000000,
            totalIncome: 5000000,
            totalExpense: 2000000,
            closingBalance: 23000000
        },
        transactions: [
            {
                id: 1,
                date: '2023-11-15',
                description: 'Mua sách',
                amount: -500000,
                type: 'expense',
                category: 'Giáo dục'
            },
            {
                id: 2,
                date: '2023-11-10',
                description: 'Lương tháng 11',
                amount: 5000000,
                type: 'income',
                category: 'Lương'
            },
            {
                id: 3,
                date: '2023-11-05',
                description: 'Ăn tối với bạn',
                amount: -300000,
                type: 'expense',
                category: 'Ăn uống'
            },
            {
                id: 4,
                date: '2023-11-03',
                description: 'Mua quần áo',
                amount: -700000,
                type: 'expense',
                category: 'Thời trang'
            },
            {
                id: 5,
                date: '2023-11-01',
                description: 'Tiền thưởng',
                amount: 1000000,
                type: 'income',
                category: 'Thưởng'
            }
        ]
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleSearch = () => {
        // Xử lý tìm kiếm theo khoảng thời gian
        console.log('Tìm kiếm từ:', filters.startDate, 'đến:', filters.endDate);
    };

    return (
        <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 3 }}>
           
            <Stack direction='column' alignItems={'start'} spacing={1} sx={{ mb: 2 }}>
                <Stack direction='row' alignItems={'center'} >
                    <ReceiptLongIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
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
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: 5 }} >
                            <TextField
                                fullWidth
                                label="Từ ngày"
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 5 }}>
                            <TextField
                                fullWidth
                                label="Đến ngày"
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<Search />}
                                onClick={handleSearch}
                                sx={{ py: 1.5 }}
                            >
                                TÌM KIẾM
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {/* Phần tổng hợp bên trái */}
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
                                <Typography variant="h6" color="primary" fontWeight="bold">
                                    {formatCurrency(statementData.summary.openingBalance)}
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
                                    +{formatCurrency(statementData.summary.totalIncome)}
                                </Typography>
                            </Box>

                            {/* Tổng chi */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TrendingDown sx={{ mr: 1, color: 'error.main', fontSize: 20 }} />
                                    <Typography variant="body1">Tổng chi:</Typography>
                                </Box>
                                <Typography variant="h6" color="error.main" fontWeight="bold">
                                    {formatCurrency(statementData.summary.totalExpense)}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Số dư cuối kỳ */}
                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Số dư cuối kỳ:
                                </Typography>
                                <Typography variant="h5" color="primary" fontWeight="bold">
                                    {formatCurrency(statementData.summary.closingBalance)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Phần chi tiết giao dịch bên phải */}
                <Grid size={{ xs: 12, sm: 8 }}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" fontWeight="bold">
                                    CHI TIẾT GIAO DỊCH
                                </Typography>
                            </Box>

                            <List sx={{ width: '100%' }}>
                                {statementData.transactions.map((transaction) => (
                                    <React.Fragment key={transaction.id}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                {transaction.type === 'income' ? (
                                                    <TrendingUp sx={{ color: 'success.main' }} />
                                                ) : (
                                                    <TrendingDown sx={{ color: 'error.main' }} />
                                                )}
                                            </ListItemIcon>

                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Box>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {transaction.description}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {formatDate(transaction.date)}
                                                                </Typography>
                                                                <Chip
                                                                    label={transaction.category}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                                />
                                                            </Box>
                                                        </Box>

                                                        <Typography
                                                            variant="h6"
                                                            fontWeight="bold"
                                                            color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                                                            sx={{
                                                                fontSize: isMobile ? '1rem' : '1.25rem',
                                                                textAlign: 'right'
                                                            }}
                                                        >
                                                            {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StatementPage;