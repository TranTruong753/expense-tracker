import { Box, Chip, Divider, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { formatCurrency, formatDate } from "../../utils";
import React from "react";
import type { TransactionStatement } from "../../types";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import dayjs from "dayjs";
import { useDeviceType } from "../../hook/useDeviceType";

function TransactionCard({ transaction }: { transaction: Partial<TransactionStatement> }) {
    const isMobile = useDeviceType('mobile')

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
                                <Typography variant="body1" fontWeight="600" fontSize={isMobile ? '17px' : '18px'}>
                                    {transaction.category} {transaction.categoryIcon}
                                </Typography>
                                {!isMobile &&
                                    (<Typography variant="body2" fontWeight="500" fontSize={isMobile ? '13px' : '14px'} sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '30rem',
                                    }}>
                                        Nội dung: {transaction.description}
                                    </Typography>)
                                }
                                <Stack direction={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'start' : 'start'} spacing={1} sx={{ mt: 0.5 }}>
                                    <Typography
                                        fontSize={isMobile ? '0.9rem' : '1rem'}
                                    >
                                        {formatDate(dayjs(transaction.transactionDate).format('YYYY-MM-DD HH:mm:ss'))}
                                    </Typography>

                                    <Chip
                                        label={transaction.category}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                    />
                                </Stack>
                            </Box>

                            <Box>
                                <Typography variant="body1" fontWeight="medium">
                                    {transaction.bank}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    color={transaction.type === 'INCOME' ? 'success.main' : 'error.main'}
                                    fontSize={isMobile ? '1.2rem' : '1.25rem'}
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