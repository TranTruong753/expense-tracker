import { Container, Stack, Typography } from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';

function TransactionPage() {
    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Stack direction='row' alignItems={'center'} justifyContent={'space-between'} sx={{ mb: 2 }}>
                <Stack direction='row' alignItems={'center'} >
                    <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" color="primary.main" fontWeight={600}>
                        LỊCH SỬ GIAO DỊCH
                    </Typography>
                </Stack>
            </Stack>
        </Container>

    );
}

export default TransactionPage;