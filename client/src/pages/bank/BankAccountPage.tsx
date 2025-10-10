import {
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Container,
    Stack
} from '@mui/material';
import {
    AccountBalance,
    Add
} from '@mui/icons-material';


const BankAccountPage = () => {
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
          
            {/* Tài khoản ngân hàng */}
            <Stack direction='row' alignItems={'center'} justifyContent={'space-between'} sx={{ mb: 2 }}>
                <Stack direction='row' alignItems={'center'} >
                    <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" color="primary.main" fontWeight={600}>
                        TÀI KHOẢN NGÂN HÀNG
                    </Typography>
                </Stack>


                {/* Nút thêm tài khoản */}
                <Button
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
                </Button>
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

export default BankAccountPage;