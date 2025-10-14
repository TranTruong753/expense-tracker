import {
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
import { useAuth } from "../../hook/useAuth";
import BankCard from '../../components/bank/BankAccountCard';
import React from 'react';
import CreateBankAccount from '../../components/modal/CreateBankAccount';
import { useDeviceType } from '../../hook/useDeviceType';

const BankAccountPage = () => {
    const { listBank } = useAuth();

    const isMobile = useDeviceType('mobile')

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>

            {/* Tài khoản ngân hàng */}
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems={isMobile ? 'start' : 'center'} justifyContent={'space-between'} sx={{ mb: 2 }}>
                <Stack direction='row' alignItems={'center'} >
                    <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" color="primary.main" 
                    fontWeight={600}
                    fontSize={isMobile ? '1.2rem' : '1.25rem'}
                    > 
                        TÀI KHOẢN NGÂN HÀNG
                    </Typography>
                </Stack>


                {/* Nút thêm tài khoản */}
                <Button
                    variant="outlined"
                    fullWidth={isMobile ? true : false}
                    size={isMobile ? 'medium' : 'large'}
                    startIcon={<Add />}
                    sx={{
                        py: isMobile ? 1 : 1.5,
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
                    onClick={() => handleOpen()}
                >
                    Thêm tài khoản
                </Button>
            </Stack>


            {/* Danh sách tài khoản */}
            <Grid container spacing={1} sx={{ mb: 3, }}>
                {listBank?.map(account => (
                    <Grid size={{ md: 12 }} key={account.id} sx={{ width: '100%' }}>
                        <BankCard account={account} />
                    </Grid>
                ))}
            </Grid>

            <CreateBankAccount open={open} onClose={handleClose} />
        </Container>
    );
};

export default BankAccountPage;