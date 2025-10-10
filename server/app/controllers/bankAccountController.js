import BankAccount from '../models/bankAccount.js'

class bankAccountController {

    // [POST] /bank-account/create
    async create(req, res, next) {
        try {
            const formData = req.body;
            const newBank = new BankAccount(formData);
            await newBank.save();
            res.status(201).json(newBank);
        } catch (error) {
            next(error);
        }
    }

}

export default new bankAccountController()