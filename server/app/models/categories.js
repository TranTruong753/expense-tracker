import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const categoriesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
    name: { type: String },
    type: {
        type: String,
        enum: ['INCOME', 'EXPENSE'],
    },
    icon: { type: String },
    isDefault: { Boolean },

}, {
    timestamps: true
});

categoriesSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v; // dọn gọn JSON trả về
        return ret;
    },
});


export default mongoose.model('categories', categoriesSchema);
