import User from '../models/user.js'
import BankAccount from '../models/bankAccount.js'
import jwt from "jsonwebtoken";
import axios from "axios";

class authController {

    // [POST] /auth/login
    async login(req, res, next) {
        try {
            const { idToken } = req.body;
            if (!idToken) {
                return res.status(400).json({ message: "Missing Google token" });
            }

            // Verify token with Google
            const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
            const { sub: googleId, email, name, picture: avatar } = googleRes.data;

            // Find or create user
            let user = await User.findOne({ googleId });
            if (!user) {
                user = await User.create({ googleId, email, name, avatar });
            }

            // Check if user has bank account
            const bankAccount = await BankAccount.findOne({ userId: user._id });
            const hasBankAccount = !!bankAccount;

            // Create your app JWT
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // Respond to frontend
            return res.json({
                success: true,
                token,
                redirectTo: hasBankAccount ? "/" : `/register-bank?id=${user._id}`,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                },
            });

        } catch (error) {
            next(error)
        }
    }

    // [POST] /auth/register
    async registerAccount(req, res, next) {
        try {
            const formData = req.body;

            const { accountNumber, bankName } = formData;

            // Kiểm tra trùng số tài khoản
            const existingAccount = await BankAccount.findOne({
                accountNumber,
                bankName,
            });
            if (existingAccount) {
                return res.status(409).json({
                    success: false,
                    message: 'Số tài khoản này đã tồn tại!',
                });
            }

            const newBank = new BankAccount(formData);

            await newBank.save();

            return res.json({
                success: true,
                redirectTo: '/',
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /api/auth/profile
    async getProfile(req, res, next) {
        try {
            // Lấy token từ header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Unauthorized: Missing token" });
            }

            const token = authHeader.split(" ")[1];

            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //  Tìm user theo id trong payload
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            //  Trả về thông tin user
            res.json({
                success: true,
                user,
            });
        } catch (error) {
            next(error);
        }

    }

    // [GET] /api/auth/check-token
    async checkToken(req, res, next) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Unauthorized: Missing token" });
            }

            const token = authHeader.split(" ")[1];

            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded) return res.status(200).json({
                success: true
            })

        } catch (error) {
            next(error);
        }
    }
}

export default new authController()