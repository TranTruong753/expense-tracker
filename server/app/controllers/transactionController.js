import BankAccount from '../models/bankAccount.js';
import Transaction from '../models/transaction.js';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';


class transactionController {
    // [POST] /transaction/create
    async create(req, res, next) {
        try {
            const formData = req.body;
            const { bankId, amount, type } = formData;

            // Kiểm tra dữ liệu đầu vào
            if (!bankId || !amount || !type) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const bank = await BankAccount.findById(bankId);
            if (!bank) {
                return res.status(404).json({ message: "Bank account not found" });
            }

            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                return res.status(400).json({ message: "Invalid amount" });
            }

            // Lấy balance hiện tại (Decimal128 -> float)
            const currentBalance = parseFloat(bank.balance.toString());

            // Xử lý theo loại giao dịch
            if (type === "INCOME") {
                bank.balance = mongoose.Types.Decimal128.fromString(
                    (currentBalance + numericAmount).toString()
                );
            } else if (type === "EXPENSE") {
                if (currentBalance < numericAmount) {
                    return res
                        .status(400)
                        .json({ message: "Insufficient balance" });
                }
                bank.balance = mongoose.Types.Decimal128.fromString(
                    (currentBalance - numericAmount).toString()
                );
            } else {
                return res.status(400).json({ message: "Invalid transaction type" });
            }

            // Lưu thay đổi số dư
            await bank.save();

            // Lưu transaction
            const newTransaction = await Transaction.create({
                ...formData,
                amount: mongoose.Types.Decimal128.fromString(numericAmount.toString()),
            });

            // Populate thông tin liên quan
            const populatedTransaction = await Transaction.findById(
                newTransaction._id
            )
                .populate({
                    path: "bankId",
                    select: "bankName",
                })
                .populate({
                    path: "categoryId",
                    select: "name icon",
                });

            // Format dữ liệu trả về
            const formatted = {
                id: populatedTransaction._id,
                amount: parseFloat(populatedTransaction.amount),
                type: populatedTransaction.type,
                description: populatedTransaction.description,
                transactionDate: populatedTransaction.transactionDate,
                bank: populatedTransaction.bankId
                    ? populatedTransaction.bankId.bankName
                    : null,
                category: populatedTransaction.categoryId
                    ? populatedTransaction.categoryId.name
                    : null,
                categoryIcon: populatedTransaction.categoryId
                    ? populatedTransaction.categoryId.icon
                    : null,
            };

            return res.status(201).json({
                success: true,
                message: "Transaction created successfully",
                data: formatted,
                bank,
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /transaction/get-list
    async getListTransaction(req, res, next) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Unauthorized: Missing token" });
            }

            const token = authHeader.split(" ")[1];

            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Lấy tất cả transaction của user, kèm bank + category
            const transactions = await Transaction.find({ userId: decoded.id })
                .populate({
                    path: 'bankId',
                    select: 'bankName',
                })
                .populate({
                    path: 'categoryId',
                    select: 'name icon',
                })
                .sort({ transactionDate: -1 });

            const formatted = transactions.map((t) => ({
                id: t._id,
                amount: parseFloat(t.amount),
                type: t.type,
                description: t.description,
                transactionDate: t.transactionDate,
                bank: t.bankId ? t.bankId.bankName  : null,
                category: t.categoryId ? t.categoryId.name : null,
                categoryIcon: t.categoryId ? t.categoryId.icon : null,
            }));

            return res.json({
                success: true,
                data: formatted,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/transaction/get-statement-by-bank?bankId=xxx&fromDate=2025-10-05&toDate=2025-10-07
    async getStatementByBank(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: Missing token' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userObjectId = new mongoose.Types.ObjectId(decoded.id);

        const { fromDate, toDate, bankId } = req.query;
        const start = new Date(`${fromDate}T00:00:00.000Z`);
        const end = new Date(`${toDate}T23:59:59.999Z`);
        const bankObjectId = new mongoose.Types.ObjectId(bankId);

        // Kiểm tra bank và lấy số dư ban đầu
        const bank = await BankAccount.findOne({
            _id: bankObjectId,
            userId: userObjectId,
        }).select('initialBalance bankName accountNumber initialDate'); // Chỉ lấy các field cần thiết
        if (!bank) {
            return res.status(404).json({ message: 'Bank not found' });
        }

        // Tối ưu: Single aggregation cho cả thu/chi trước kỳ và trong kỳ
        const summaryAgg = await Transaction.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    bankId: bankObjectId,
                    transactionDate: { $lte: end } 
                }
            },
            {
                $group: {
                    _id: {
                        period: {
                            $cond: [
                                { $lt: ["$transactionDate", start] },
                                "before",
                                "period"
                            ]
                        },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Khởi tạo giá trị mặc định
        let totalIncomeBefore = 0;
        let totalExpenseBefore = 0;
        let totalIncome = 0;
        let totalExpense = 0;

        // Xử lý kết quả aggregation
        summaryAgg.forEach(item => {
            const amount = parseFloat(item.total);
            if (item._id.period === "before") {
                if (item._id.type === "INCOME") totalIncomeBefore = amount;
                else if (item._id.type === "EXPENSE") totalExpenseBefore = amount;
            } else {
                if (item._id.type === "INCOME") totalIncome = amount;
                else if (item._id.type === "EXPENSE") totalExpense = amount;
            }
        });

        // Số dư đầu kỳ
        const openingBalance = parseFloat(bank.initialBalance) + totalIncomeBefore - totalExpenseBefore;

        // Lấy giao dịch trong kỳ với projection tối ưu
        const transactions = await Transaction.find({
            userId: userObjectId,
            bankId: bankObjectId,
            transactionDate: { $gte: start, $lte: end },
        })
        .populate({
            path: 'categoryId',
            select: 'name icon',
        })
        .select('transactionDate description type amount categoryId') // Chỉ lấy fields cần thiết
        .sort({ transactionDate: -1 })
        .lean();

        // Xử lý chi tiết từng dòng với reduce (hiệu năng tốt hơn)
        let runningBalance = openingBalance;
        const statementRows = transactions.map(t => {
            const isIncome = t.type === 'INCOME';
            const moneyIn = isIncome ? parseFloat(t.amount) : 0;
            const moneyOut = !isIncome ? parseFloat(t.amount) : 0;
            
            const row = {
                date: t.transactionDate.toISOString().split('T')[0],
                description: t.description || '',
                opening: runningBalance,
                moneyIn,
                moneyOut,
                closing: runningBalance + moneyIn - moneyOut,
                category: t.categoryId?.name || null,
                categoryIcon: t.categoryId?.icon || null,
            };

            runningBalance = row.closing;
            return row;
        });

        // Số dư cuối kỳ
        const closingBalance = runningBalance;

        return res.json({
            success: true,
            data: {
                bank,
                fromDate,
                toDate,
                totalIncome,
                totalExpense,
                openingBalance,
                closingBalance,
                transactions: statementRows,
            },
        });

    } catch (err) {
        next(err);
    }
}


}

export default new transactionController();