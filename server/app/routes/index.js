import categoriesRouter from './categories.js';
import bankAccountRouter from './bankAccount.js';
import authRouter from './auth.js';
import transactionRouter from './transaction.js';

function route(app) {
    app.use('/auth', authRouter);
    app.use('/categories', categoriesRouter);
    app.use('/bank-account', bankAccountRouter);
    app.use('/transaction', transactionRouter);
}

export default route;