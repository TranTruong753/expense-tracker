import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount', required: true, index: true },
    amount: { type: mongoose.Schema.Types.Decimal128, required: true },
    type: {
        type: String,
        enum: ['INCOME', 'EXPENSE']
    },
    accountNumber: { type: String, required: true },
    balance: { type: Number, default: 0 },
    initialBalance: { type: Number, default: 0 },
}, {
    timestamps: true
});

transactionSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.amount) {
            ret.amount = parseFloat(ret.amount.toString());
        }
        return ret;
    },
});

export default mongoose.model('Transaction', transactionSchema);
