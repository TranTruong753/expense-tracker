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
    isDefault: { type: Boolean, default: true },

}, {
    timestamps: true
});

categoriesSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;      
        delete ret._id;      
        delete ret.__v; 
        return ret;
    },
});


export default mongoose.model('Categories', categoriesSchema);
