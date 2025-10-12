import { Box, Card, CardContent, Container, List, Stack, Typography } from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';
import { useAuth } from "../../hook/useAuth";
import { Receipt } from "@mui/icons-material";
import TransactionCard from "../../components/transaction/TransactionCard";

function TransactionPage() {
    const { listTransaction } = useAuth()

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Stack direction='row' alignItems={'center'} justifyContent={'space-between'} sx={{ mb: 2 }}>
                <Stack direction='row' alignItems={'center'} >
                    <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" color="primary.main" fontWeight={600}>
                        LỊCH SỬ GIAO DỊCH
                    </Typography>
                </Stack>
            </Stack>
            <Card sx={{height: '80vh'}}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight="bold">
                            CHI TIẾT GIAO DỊCH
                        </Typography>
                    </Box>

                    <List sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        {listTransaction?.map((transaction) => (
                            <TransactionCard transaction={transaction} />
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Container>

    );
}

export default TransactionPage;