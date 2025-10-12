import { Box, Chip, Divider, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { formatCurrency, formatDate } from "../../utils";
import React from "react";
import type { TransactionStatement } from "../../types";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import dayjs from "dayjs";

function TransactionCard({ transaction }: { transaction: Partial<TransactionStatement> }) {
    return (
        <React.Fragment key={transaction.id}>
            <ListItem alignItems="flex-start" >
                <ListItemIcon sx={{ minWidth: 40 }}>
                    {transaction.type === 'INCOME' ? (
                        <TrendingUp sx={{ color: 'success.main' }} />
                    ) : (
                        <TrendingDown sx={{ color: 'error.main' }} />
                    )}
                </ListItemIcon>

                <ListItemText
                    primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="body1" fontWeight="600" fontSize={'18px'}>
                                    {transaction.category} {transaction.categoryIcon}
                                </Typography>
                                <Typography variant="body2" fontWeight="500" fontSize={'14px'} sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '30rem',
                                }}>
                                    Nội dung: {transaction.description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <Typography>
                                        {formatDate(dayjs(transaction.transactionDate).format('YYYY-MM-DD HH:mm:ss'))}
                                    </Typography>

                                    <Chip
                                        label={transaction.category}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                    />
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="body1" fontWeight="medium">
                                    {transaction.bank}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    color={transaction.type === 'INCOME' ? 'success.main' : 'error.main'}
                                    sx={{
                                        textAlign: 'right'
                                    }}
                                >
                                    {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount ? Number(transaction.amount) : 0)}
                                </Typography>
                            </Box>
                        </Box>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
        </React.Fragment>
    );
}

export default TransactionCard;