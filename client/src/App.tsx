import { Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './layout/MainLayout '
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/LoginPage'
import BankAccountPage from './pages/bank/BankAccountPage'
import StatementPage from './pages/statement/StatementPage'
import TransactionPage from './pages/transaction/TransactionPage'
import RegisterPage from './pages/register/RegisterPage'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/bank-account" element={<BankAccountPage />} />
        <Route path="/statement" element={<StatementPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/register-bank" element={<RegisterPage />}></Route>
    </Routes>

  )
}

export default App
