import mongoose from 'mongoose';
import initializeData from '../../utils/seed.js';

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connect successfully!!!");
        // Khởi tạo dữ liệu seed sau khi kết nối database thành công
        await initializeData();
    } catch {
        console.log("Connect failure!!!");
    }
}

export default { connect };