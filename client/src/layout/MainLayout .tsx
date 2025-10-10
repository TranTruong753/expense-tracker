import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AppProvider, type Navigation, type Router, type Session } from '@toolpad/core/AppProvider';
import React from "react";


const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Chức năng',
    },
    {
        title: 'Trang chủ',
    },
    {
        segment: 'bank-account',
        title: 'Tài khoản ngân hàng',
    },
    {
        segment: 'transaction',
        title: 'Giao dịch',
    },
    {
        segment: 'statement',
        title: 'Sao kê',
    },

]

function MainLayout() {
    const [session, setSession] = React.useState<Session | null>({
        user: {
            name: 'Bharat Kashyap',
            email: 'bharatkashyap@outlook.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Bharat Kashyap',
                        email: 'bharatkashyap@outlook.com',
                        image: 'https://avatars.githubusercontent.com/u/19550456',
                    },
                });
            },
            signOut: () => {
                setSession(null);
            },
        };
    }, []);

    // ✅ Adapter để đồng bộ React Router với Toolpad
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const router = React.useMemo(
        () => ({
            pathname: location.pathname,
            searchParams: new URLSearchParams(location.search),
            navigate: (path: string) => navigate(path),
            params,
        }),
        [location, navigate, params]
    );

    return (
        <AppProvider
            router={router as Router | undefined}
            session={session}
            navigation={NAVIGATION}
            authentication={authentication}
            branding={{
                title: "App quản lý chi thu"
            }}
        >
            <DashboardLayout>
                <Outlet />
            </DashboardLayout>
        </AppProvider>
    );
}

export default MainLayout;