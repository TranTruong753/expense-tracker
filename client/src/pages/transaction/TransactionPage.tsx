import { Box, Card, CardContent, Container, List, Stack, Typography } from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';
import { useAuth } from "../../hook/useAuth";
import { Receipt } from "@mui/icons-material";
import TransactionCard from "../../components/transaction/TransactionCard";
import { useDeviceType } from "../../hook/useDeviceType";

function TransactionPage() {
    const { listTransaction } = useAuth()

    const isMobile = useDeviceType('mobile')

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Stack direction='row' alignItems={'center'} justifyContent={'space-between'} sx={{ mb: 2 }}>
                <Stack direction='row' alignItems={'center'} >
                    <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography
                        variant="h6"
                        color="primary.main"
                        fontWeight={600}
                        fontSize={isMobile ? '1.2rem' : '1.25rem'}
                    >
                        LỊCH SỬ GIAO DỊCH
                    </Typography>
                </Stack>
            </Stack>
            <Card sx={{ height: '75vh' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            fontSize={isMobile ? '1rem' : '1.2rem'}
                        >
                            CHI TIẾT GIAO DỊCH
                        </Typography>
                    </Box>

                    {(listTransaction && listTransaction.length > 0) ?
                        (<List sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                            {listTransaction?.map((transaction) => (
                                <TransactionCard transaction={transaction} />
                            ))}
                        </List>) :
                        (<Stack direction={'row'} justifyContent={'center'} alignItems={'center'} height={'30vh'}>
                            <Typography component={'span'} fontSize={'18px'}>Bạn chưa có giao dịch nào</Typography>
                        </Stack>)
                    }
                </CardContent>
            </Card>
        </Container>

    );
}

export default TransactionPage;