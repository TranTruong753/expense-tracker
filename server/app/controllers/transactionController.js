import BankAccount from '../models/bankAccount.js';
import Transaction from '../models/transaction.js';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';


class transactionController {
    // [POST] /transaction/create
    async create(req, res, next) {
        try {
            console.log("BODY:", req.body);
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
            console.error(error);
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
            console.error(error);
            next(error);
        }
    }

    // [GET] /transaction/get-list-from-to?fromDate=2025-10-10&toDate=2025-10-11
    async getListTransactionFromDayToDay(req, res, next) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Unauthorized: Missing token" });
            }

            const token = authHeader.split(" ")[1];

            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Lấy fromDate và toDate từ query
            const { fromDate, toDate } = req.query;

            const filter = { userId: decoded.id };

            // Nếu có fromDate hoặc toDate thì thêm vào điều kiện transactionDate
            if (fromDate || toDate) {
                filter.transactionDate = {};

                if (fromDate) {
                    // set 00:00:00 để tính từ đầu ngày
                    filter.transactionDate.$gte = new Date(`${fromDate}T00:00:00.000Z`);
                }

                if (toDate) {
                    // set 23:59:59 để lấy hết giao dịch trong ngày kết thúc
                    filter.transactionDate.$lte = new Date(`${toDate}T23:59:59.999Z`);
                }
            }

            // Lấy tất cả transaction của user, kèm bank + category
            const transactions = await Transaction.find(filter)
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
                bank: t.bankId ? t.bankId.bankName : null,
                category: t.categoryId ? t.categoryId.name : null,
                categoryIcon: t.categoryId ? t.categoryId.icon : null,
            }));

            return res.json({
                success: true,
                data: formatted,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }


    // [GET] /transaction/get-statement?fromDate=2025-10-10&toDate=2025-10-11
    async getStatement(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized: Missing token' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const userObjectId = new mongoose.Types.ObjectId(decoded.id);
            const { fromDate, toDate } = req.query;
            const start = new Date(fromDate);
            const end = new Date(`${toDate}T23:59:59.999Z`);

            // Lấy tổng số dư ban đầu của TẤT CẢ tài khoản
            const totalInitialBalanceAgg = await BankAccount.aggregate([
                {
                    $match: {
                        userId: userObjectId
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalInitial: { $sum: '$initialBalance' }
                    }
                }
            ]);
            const totalInitialBalance = parseFloat(totalInitialBalanceAgg[0]?.totalInitial?.toString() || '0');

            // Tổng thu TRƯỚC kỳ (trước fromDate)
            const incomeBeforeAgg = await Transaction.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        type: 'INCOME',
                        transactionDate: { $lt: start }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);
            const totalIncomeBefore = parseFloat(incomeBeforeAgg[0]?.total || 0);

            // Tổng chi TRƯỚC kỳ (trước fromDate)
            const expenseBeforeAgg = await Transaction.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        type: 'EXPENSE',
                        transactionDate: { $lt: start }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);
            const totalExpenseBefore = parseFloat(expenseBeforeAgg[0]?.total || 0);

            // Tổng thu TRONG kỳ
            const incomeAgg = await Transaction.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        type: 'INCOME',
                        transactionDate: { $gte: start, $lte: end }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);
            const totalIncome = parseFloat(incomeAgg[0]?.total || 0);

            // Tổng chi TRONG kỳ
            const expenseAgg = await Transaction.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        type: 'EXPENSE',
                        transactionDate: { $gte: start, $lte: end }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);
            const totalExpense = parseFloat(expenseAgg[0]?.total || 0);

            // Số dư đầu kỳ = Số dư ban đầu + (Tổng thu trước kỳ - Tổng chi trước kỳ)
            const startBalance = totalInitialBalance + totalIncomeBefore - totalExpenseBefore;

            // console.log("totalInitialBalance", totalInitialBalance, "totalIncomeBefore", totalIncomeBefore, "-totalExpenseBefore", totalExpenseBefore)

            // Số dư cuối kỳ = Số dư đầu kỳ + (Tổng thu trong kỳ - Tổng chi trong kỳ)
            const endBalance = startBalance + totalIncome - totalExpense;

            // console.log("startBalance", startBalance, "totalIncome", totalIncome, "-totalExpense", totalExpense)

            return res.json({
                success: true,
                data: {
                    fromDate,
                    toDate,
                    startBalance,
                    totalIncome,
                    totalExpense,
                    endBalance,
                    debug: {
                        totalInitialBalance,
                        totalIncomeBefore,
                        totalExpenseBefore
                    }
                },
            });
        } catch (err) {
            console.error(err);
            next(err);
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

            // ✅ Lấy thông tin bank
            const bank = await BankAccount.findOne({
                _id: bankId,
                userId: userObjectId,
            });
            if (!bank) {
                return res.status(404).json({ message: 'Bank not found' });
            }

            // ✅ Tổng thu trước kỳ
            const incomeBeforeAgg = await Transaction.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        bankId: new mongoose.Types.ObjectId(bankId),
                        type: 'INCOME',
                        transactionDate: { $lt: start },
                    },
                },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);
            const totalIncomeBefore = parseFloat(incomeBeforeAgg[0]?.total || 0);

            console.log("totalIncomeBefore", totalIncomeBefore)

            // ✅ Tổng chi trước kỳ
            const expenseBeforeAgg = await Transaction.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        bankId: new mongoose.Types.ObjectId(bankId),
                        type: 'EXPENSE',
                        transactionDate: { $lt: start },
                    },
                },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);
            const totalExpenseBefore = parseFloat(expenseBeforeAgg[0]?.total || 0);

            console.log("totalExpenseBefore", totalExpenseBefore)

            // Tổng thu TRONG kỳ
            const incomeAgg = await Transaction.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        bankId: new mongoose.Types.ObjectId(bankId),
                        type: 'INCOME',
                        transactionDate: { $gte: start, $lte: end }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);
            const totalIncome = parseFloat(incomeAgg[0]?.total || 0);

            // Tổng chi TRONG kỳ
            const expenseAgg = await Transaction.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        bankId: new mongoose.Types.ObjectId(bankId),
                        type: 'EXPENSE',
                        transactionDate: { $gte: start, $lte: end }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]);
            const totalExpense = parseFloat(expenseAgg[0]?.total || 0);

            // ✅ Số dư đầu kỳ
            let openingBalance = parseFloat(bank.initialBalance) + totalIncomeBefore - totalExpenseBefore;

            // ✅ Lấy giao dịch trong kỳ
            const transactions = await Transaction.find({
                userId: userObjectId,
                bankId,
                transactionDate: { $gte: start, $lte: end },
            })
                .populate({
                    path: 'categoryId',
                    select: 'name icon',
                })
                .sort({ transactionDate: -1 })
            // .sort({ transactionDate: 1 });

            // ✅ Xử lý chi tiết từng dòng
            const statementRows = [];
            let runningBalance = openingBalance;

            for (const t of transactions) {
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
                    category: t.categoryId ? t.categoryId.name : null,
                    categoryIcon: t.categoryId ? t.categoryId.icon : null,
                };

                // Cập nhật số dư cho dòng tiếp theo
                runningBalance = row.closing;
                statementRows.push(row);
            }

            // ✅ Tổng kết cuối kỳ
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
            console.error(err);
            next(err);
        }
    }


}

export default new transactionController();