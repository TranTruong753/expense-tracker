import { Card, CardContent, Typography } from "@mui/material";
import type { BankAccount } from "../../types";
import { formatCurrency } from "../../utils";

const BankCard = ({ account }: { account: BankAccount}) => (
  <Card
    key={account.id}
    variant="outlined"
    sx={{
      borderLeft: '4px solid #1976d2',
      transition: 'all 0.3s ease',
      '&:hover': { boxShadow: 2, transform: 'translateY(-2px)' },
      mb:2,
    }}
  >
    <CardContent>
      <Typography variant="h6" gutterBottom>{account.bankName}</Typography>
      <Typography variant="body1" color="text.secondary">
        Số tài khoản:
        <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 1}} fontSize={'16px'}>
          {account.accountNumber}
        </Typography>
      </Typography>
       <Typography variant="body1" color="text.secondary">
        Số dư:
        <Typography component="span" variant="h6" color="primary" sx={{ ml: 1, fontWeight: 'bold' }}>
          {formatCurrency(account.balance)}
        </Typography>
      </Typography>
    </CardContent>
  </Card>
);


export default BankCard;