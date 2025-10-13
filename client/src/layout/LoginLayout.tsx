import { NotificationsProvider } from "@toolpad/core/useNotifications";
import { Outlet } from "react-router-dom";

function LoginLayout() {
    return (
        <NotificationsProvider
            slotProps={{
                snackbar: {
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    autoHideDuration: 2000
                },
            }}
        >
            <Outlet />
        </NotificationsProvider>
    );
}

export default LoginLayout;