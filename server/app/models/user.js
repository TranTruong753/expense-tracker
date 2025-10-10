import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
