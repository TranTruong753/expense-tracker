import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const bankAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  balance: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  initialBalance: { type: mongoose.Schema.Types.Decimal128, default: 0 },

}, {
  timestamps: true
});

bankAccountSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.balance != null) {
      ret.balance = parseFloat(ret.balance.toString());
    }
    if (ret.initialBalance != null) {
      ret.initialBalance = parseFloat(ret.initialBalance.toString());
    }
    ret.id = ret._id;     
    delete ret._id;        
    delete ret.__v;        
    return ret;
  },
});



export default mongoose.model('BankAccount', bankAccountSchema);
