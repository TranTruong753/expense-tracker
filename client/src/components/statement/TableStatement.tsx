import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Stack,
} from '@mui/material';
import type { StatementTableIf } from '../../types';


function TableStatement({ data }: { data?: Partial<StatementTableIf> }) {
    const transactions = data?.transactions;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Handle pagination
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Calculate paginated data
    const paginatedTransactions = transactions?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Format currency display
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <Paper sx={{ height: '40vh' }}>
            <Stack direction={'column'} justifyContent={'space-between'} alignItems={'start'} sx={{ height: '40vh' }}>
                <TableContainer  sx={{ height: '80%' }} >
                    <Table sx={{
                        minWidth: 650,
                    }} aria-label="statement table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Ngày</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nội dung</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Đầu kỳ</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Tiền vào</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Tiền ra</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Cuối kỳ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedTransactions?.map((transaction, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': { backgroundColor: '#fafafa' }
                                    }}
                                >
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: 8 }}>{transaction.categoryIcon}</span>
                                            {transaction.description}
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">{formatCurrency(transaction.opening)}</TableCell>
                                    <TableCell align="right" sx={{ color: 'green' }}>
                                        {transaction.moneyIn > 0 ? formatCurrency(transaction.moneyIn) : '-'}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: 'red' }}>
                                        {transaction.moneyOut > 0 ? formatCurrency(transaction.moneyOut) : '-'}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        {formatCurrency(transaction.closing)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
    
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={transactions?.length ? transactions.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} trong tổng ${count}`
                    }
                />
            </Stack>
        </Paper>
    );
}

export default TableStatement;