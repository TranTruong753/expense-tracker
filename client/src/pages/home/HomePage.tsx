import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Paper,
    Container,
    Avatar,
    Stack
} from '@mui/material';
import {
    AccountBalance,
    AccountBalanceWallet,
    Add,
    BarChart
} from '@mui/icons-material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const HomePage = () => {
    // Dữ liệu mẫu
    const userData = {
        name: "Nguyễn Văn A",
        totalBalance: 25000000,
        bankAccounts: [
            { id: 1, bankName: "Vietcombank", balance: 15000000, color: "#1976d2" },
            { id: 2, bankName: "Techcombank", balance: 10000000, color: "#2e7d32" },
            { id: 2, bankName: "Techcombank", balance: 10000000, color: "#2e7d32" }
        ]
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Header */}
            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                        👤
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                        {userData.name}
                    </Typography>
                </Box>
                <Stack direction={'row'} spacing={2}>



                    <Button
                        variant="contained"
                        startIcon={<BarChart />}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                        }}
                    >
                        Xem sao kê
                    </Button>
                </Stack>
            </Paper>

            <Stack direction={'row'} alignItems={'center'} justifyContent={'end'} spacing={2} mb={2}>
                <Button
                    variant="contained"
                    startIcon={<TrendingUpIcon />}
                    color='primary'
                    sx={{
                        bgcolor: '#f8f9fa',
                        color: '#20c441',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#20c441', color: 'white' }
                    }}
                >
                    Tiền vào
                </Button>

                <Button
                    variant="contained"
                    startIcon={<TrendingDownIcon />}
                    color='primary'
                    sx={{
                        bgcolor: '#f8f9fa',
                        color: '#e21212',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#e21212', color: 'white' }
                    }}
                >
                    Tiền ra
                </Button>
            </Stack>

            {/* Tổng tài sản */}
            <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
                <CardContent sx={{ textAlign: 'start', py: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', mb: 1 }}>
                        <AccountBalanceWallet sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" color="text.secondary" fontSize={'14px'} fontWeight={600}>
                            Số dư hiện tại:
                        </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        {formatCurrency(userData.totalBalance)}
                    </Typography>
                </CardContent>
            </Card>

            {/* Tài khoản ngân hàng */}
            <Stack direction='row' alignItems={'center'} justifyContent={'space-between'} sx={{ mb: 2 }}>
                <Stack direction='row' alignItems={'center'} >
                    <AccountBalance sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
                        TÀI KHOẢN NGÂN HÀNG
                    </Typography>
                </Stack>


                {/* Nút thêm tài khoản */}
                {/* <Button
                    variant="outlined"

                    startIcon={<Add />}
                    sx={{
                        py: 1.5,
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            borderStyle: 'dashed',
                            borderWidth: 2,
                            bgcolor: 'primary.light',
                            color: 'white'
                        }
                    }}
                >
                    Thêm tài khoản
                </Button> */}
            </Stack>


            {/* Danh sách tài khoản */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {userData.bankAccounts.map((account) => (
                    <Grid size={{ md: 12 }} key={account.id}>
                        <Card
                            variant="outlined"
                            sx={{
                                borderLeft: `4px solid ${account.color}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: 2,
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {account.bankName}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Số dư:
                                    <Typography
                                        component="span"
                                        variant="h6"
                                        color="primary"
                                        sx={{ ml: 1, fontWeight: 'bold' }}
                                    >
                                        {formatCurrency(account.balance)}
                                    </Typography>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>


        </Container>
    );
};

export default HomePage;