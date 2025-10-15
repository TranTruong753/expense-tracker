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
    Stack,
    List
} from '@mui/material';
import {
    AccountBalance,
    AccountBalanceWallet,
    BarChart
} from '@mui/icons-material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import React from 'react';
import BankCard from '../../components/bank/BankAccountCard';
import { formatCurrency } from '../../utils';
import ExpenseModal from '../../components/modal/ExpenseModal ';
import IncomeModal from '../../components/modal/IncomeModal';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import TransactionCard from '../../components/transaction/TransactionCard';
import { useAuth } from '../../hook/useAuth';
import { useDeviceType } from '../../hook/useDeviceType';


const HomePage = () => {
    const { user, listBank, listTransaction } = useAuth();

    const isMobile = useDeviceType('mobile')

    const navigator = useNavigate()

    const [openExpense, setOpenExpense] = React.useState(false);
    const handleOpenExpense = () => setOpenExpense(true);
    const handleCloseExpense = () => setOpenExpense(false);

    const [openIncome, setOpenIncome] = React.useState(false);
    const handleOpenIncome = () => setOpenIncome(true);
    const handleCloseIncome = () => setOpenIncome(false);


    const totalBalance = React.useMemo(() => {
        if (!listBank) return 0;
        return listBank.reduce((sum, item) => sum + item.balance, 0);
    }, [listBank]);


    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
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
                    <Avatar src={user?.avatar} >
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" fontSize={isMobile ? '0.9rem' : '1.25rem'}>
                        {user?.name}
                    </Typography>
                </Box>
                <Stack direction={'row'} spacing={2}>

                    <Button
                        variant="contained"
                        startIcon={<BarChart fontSize='inherit' />}
                        size={isMobile ? 'small' : 'large'}
                        fullWidth
                        sx={{
                            whiteSpace: 'nowrap',
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                        }}
                        onClick={() => navigator('/statement')}
                    >
                        Xem sao kê
                    </Button>
                </Stack>
            </Paper>



            {/* Tổng tài sản */}
            <Card sx={{
                mb: isMobile ? 2 : 3,
                bgcolor: '#background.paper',
                pb: 0
            }}
            >
                <CardContent sx={{ py: '2 !important' }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'start'}
                        sx={{
                            pl: isMobile ? 0 : 1,

                        }}
                    >
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', mb: 1 }}>
                                <AccountBalanceWallet sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" color="text.secondary" fontSize={'14px'} fontWeight={600}>
                                    Số dư hiện tại:
                                </Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" color="primary" fontSize={isMobile ? '1.5rem' : '2.25rem'}>
                                {formatCurrency(totalBalance)}
                            </Typography>
                        </Box>

                        <Stack direction={isMobile ? 'column' : 'row'} alignItems={'center'} justifyContent={'end'} spacing={2}>
                            <Button
                                variant="contained"
                                startIcon={<TrendingUpIcon />}
                                fullWidth
                                color='primary'
                                sx={{
                                    whiteSpace: 'nowrap',
                                    bgcolor: '#f8f9fa',
                                    color: '#20c441',
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#20c441', color: 'white' }
                                }}
                                onClick={() => handleOpenIncome()}
                            >
                                Tiền vào
                            </Button>

                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<TrendingDownIcon />}
                                color='primary'
                                sx={{
                                    whiteSpace: 'nowrap',
                                    bgcolor: '#f8f9fa',
                                    color: '#e21212',
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#e21212', color: 'white' }
                                }}
                                onClick={() => handleOpenExpense()}
                            >
                                Tiền ra
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack direction='row' alignItems={'center'} justifyContent={'space-between'} sx={{ mb: 2 }}>
                        <Stack direction='row' alignItems={'center'} >
                            <AccountBalance sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="h6" color="text.secondary" fontWeight={600} fontSize={isMobile ? '1rem' : '1.2rem'}>
                                TÀI KHOẢN NGÂN HÀNG
                            </Typography>
                        </Stack>

                    </Stack>
                    {listBank?.map(account => (
                        <Box key={account.id}>
                            <BankCard account={account} />
                        </Box>
                    ))}
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack direction='row' alignItems={'center'} justifyContent={'space-between'} sx={{ mb: 2 }}>
                        <Stack direction='row' alignItems={'center'} >
                            <HistoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="h6" color="text.secondary" fontWeight={600} fontSize={isMobile ? '1rem' : '1.2rem'}>
                                LỊCH SỬ GIAO DỊCH
                            </Typography>
                        </Stack>
                    </Stack>

                    <Card sx={{ minHeight: '40vh' }}>
                        <CardContent sx={{ py: 0 }}>

                            {(listTransaction && listTransaction.length > 0) ?
                                (<List sx={{ width: '100%', height: '40vh', overflowY: 'auto' }}>
                                    {listTransaction.map((transaction) => (
                                        <Box key={transaction.id} > <TransactionCard transaction={transaction} /></Box>
                                    ))}
                                </List>) :
                                <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} height={'30vh'}>
                                    <Typography component={'span'} fontSize={isMobile ? '16px' :'18px'}>Bạn chưa có giao dịch nào</Typography>
                                </Stack>

                            }

                        </CardContent>
                    </Card>

                </Grid>
            </Grid>

            {/* Modal */}

            <ExpenseModal open={openExpense} onClose={handleCloseExpense} />

            <IncomeModal open={openIncome} onClose={handleCloseIncome} />


        </Container>
    );
};

export default HomePage;