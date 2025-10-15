import BankAccount from '../models/bankAccount.js';

class bankAccountController {

    // [POST] /bank-account/create
    async create(req, res, next) {
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

            return res.status(200).json({
                success: true,
                bank: newBank
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /bank-account/get-all-bank/:id'
    async getAllBankByUserId(req, res, next) {
        try {
            const { id } = req.params; // Lấy userId từ URL

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID Không tồn tại!",
                });
            }

            // Tìm tất cả tài khoản ngân hàng của user
            const bankAccounts = await BankAccount.find({ userId: id });

            return res.json({
                success: true,
                data: bankAccounts,
            });
        } catch (error) {
            next(error);
        }
    }


}

export default new bankAccountController();