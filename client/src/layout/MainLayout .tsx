import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AppProvider, type Navigation, type Router, type Session } from '@toolpad/core/AppProvider';
import React, { useEffect } from "react";
import { clearToken, getAccessToken } from "../services/tokenService";
import { apiGetProfile } from "../services/authService";
import { apiGetAllBankByUserId } from "../services/bankAccountService";
import { createTheme } from "@mui/material";
import LoadingPage from "../pages/loading/LoadingPage";
import { apiGetAllCategory } from "../services/categoryService";
import { NotificationsProvider } from "@toolpad/core";
import { apiGetListTransaction } from "../services/transactionService";
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useAuth } from "../hook/useAuth";
import { useDeviceType } from "../hook/useDeviceType";


const theme = createTheme({
    palette: {
        mode: 'light',
    },
});

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Chức năng',
    },
    {
        title: 'Trang chủ',
        icon: <HomeIcon />
    },
    {
        segment: 'bank-account',
        title: 'Tài khoản ngân hàng',
        icon: <AccountBalanceIcon />
    },
    {
        segment: 'transaction',
        title: 'Lịch sử giao dịch',
        icon: <HistoryIcon />
    },
    {
        segment: 'statement',
        title: 'Sao kê',
        icon: <ReceiptLongIcon />
    },

]

function MainLayout() {

    const { setUser, user, setListBank, loadingPage, setLoadingPage, setListCategories, setListTransaction } = useAuth()

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const isMobile = useDeviceType('mobile')

    const fetchProfile = async () => {
        try {
            const [resCategory, resProfile, resTransaction] = await Promise.all([
                apiGetAllCategory(),
                apiGetProfile(),
                apiGetListTransaction()
            ])
            if (resCategory) {
                setListCategories(resCategory.data)
            }

            if (resProfile) {
                setUser(resProfile.user);

                fetchListBankAccount(resProfile.user.id)

                setSession({
                    user: {
                        name: resProfile.user.name,
                        email: resProfile.user.email,
                        image: resProfile.user.avatar,
                    },
                });
            }
            if (resTransaction) {
                setListTransaction(resTransaction.data)
            }

        } catch {
            clearToken()
            if (location.pathname !== '/login') {
                navigate('/login');
            }
        }
        finally {
            setLoadingPage(false)
        }
    }

    useEffect(() => {
        const token = getAccessToken();
        if (!token && location.pathname !== '/login') {
            navigate('/login');
        }
        setLoadingPage(true)
        fetchProfile()
    }, [])

    const fetchListBankAccount = async (id: string) => {
        const res = await apiGetAllBankByUserId(id);
        if (res) {
            setListBank(res.data)
        }
    }

    useEffect(() => {
        if (!user) return
        fetchListBankAccount(user.id)
    }, [user])


    const [session, setSession] = React.useState<Session | null>({});

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession(
                    {
                        user: {
                            name: user?.name,
                            email: user?.email,
                            image: user?.avatar
                        }
                    }
                )
            },
            signOut: () => {
                setSession(null);
                clearToken()
                if (location.pathname !== '/login') {
                    navigate('/login');
                }
            },
        };
    }, []);


    const router = React.useMemo(
        () => ({
            pathname: location.pathname,
            searchParams: new URLSearchParams(location.search),
            navigate: (path: string) => navigate(path),
            params,
        }),
        [location, navigate, params]
    );

    if (loadingPage)
        return (
            <LoadingPage />
        )

    return (
        <AppProvider
            theme={theme}
            router={router as Router | undefined}
            session={session}
            navigation={NAVIGATION}
            authentication={authentication}
            branding={{
                title: "Web quản lý chi tiêu",
                logo: <img
                    src={isMobile ? '/logo/Logo-small.png' :'/logo/Logo.png'}
                    alt="MyApp Logo"
                    style={{ width: '100%', height: '100&', 'objectFit': 'cover' }}
                />

            }}

        >
            <NotificationsProvider
                slotProps={{
                    snackbar: {
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        autoHideDuration: 2000
                    },
                }}
            >
                <DashboardLayout>
                    <Outlet />
                </DashboardLayout>
            </NotificationsProvider>
        </AppProvider>
    );
}

export default MainLayout;