import { Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './layout/MainLayout '
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/LoginPage'
import BankAccountPage from './pages/bank/BankAccountPage'
import StatementPage from './pages/statement/StatementPage'
import TransactionPage from './pages/transaction/TransactionPage'
import RegisterPage from './pages/register/RegisterPage'
import NotFoundPage from './pages/notFound/NotFoundPage '
import LoginLayout from './layout/LoginLayout'


function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={
          <HomePage />
        } />
        <Route path="/bank-account" element={
          <BankAccountPage />
        } />
        <Route path="/statement" element={
          <StatementPage />
        } />
        <Route path="/transaction" element={
          <TransactionPage />
        } />
      </Route>
      <Route element={<LoginLayout/>}>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/register-bank" element={<RegisterPage />}></Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>

  )
}

export default App
