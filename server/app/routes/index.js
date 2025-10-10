import categoriesRouter from './categories.js'
import bankAccountRouter from './bankAccount.js'
import authRouter from './auth.js'

function route(app) {
    app.use('/auth', authRouter)
    app.use('/categories', categoriesRouter)
    app.use('/bank-account', bankAccountRouter)
}

export default route;