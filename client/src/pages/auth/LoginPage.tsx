import { Box, Card, Container, Stack, Typography } from "@mui/material";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import AddCardIcon from '@mui/icons-material/AddCard';
import { apiGoogleLogin } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@toolpad/core";
import React from "react";
import { getAccessToken, setAccessToken } from "../../services/tokenService";
import { useDeviceType } from "../../hook/useDeviceType";

function LoginPage() {

    const navigate = useNavigate();

    const isMobile = useDeviceType('mobile')

    const notifications = useNotifications()

    const onSuccess = async (credentialResponse: CredentialResponse) => {
        const idToken = credentialResponse.credential;

        if (!idToken) return

        try {
            const { redirectTo, token } = await apiGoogleLogin(idToken)

            if (token) setAccessToken(token)

            navigate(redirectTo)
        } catch {
            notifications.show('Lỗi máy chủ! vui lòng thử lại sau', {
                severity: "error",
            });
        }
    }

    React.useEffect(() => {
        const token = getAccessToken();
        if (token) navigate('/');
    }, [])


    return (
        <Box sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
            <Container maxWidth='xl'>
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    minHeight={'100vh'}

                >
                    <Card
                        variant="outlined"
                        sx={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            width: 400,
                            maxWidth: isMobile ? '70vw' : '90vw',
                            px: isMobile ? 3 : 4,
                            py: isMobile ? 3 : 5,
                            borderRadius: 3,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        <Stack
                            direction={'column'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            spacing={isMobile ? 2 : 3}
                        >
                            {/* Logo/Icon Section */}
                            <Box
                                sx={{
                                    width: isMobile ? 60 : 80,
                                    height: isMobile ? 60 : 80,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: isMobile ? 1 : 2
                                }}
                            >
                                <AddCardIcon fontSize={isMobile ? "medium" : "large"} sx={{ color: 'white' }} />

                            </Box>

                            {/* Title Section */}
                            <Stack direction={'column'} alignItems={'center'} spacing={1}>
                                <Typography
                                    variant="h1"
                                    fontSize={isMobile ? '1.4rem' : '1.8rem'}
                                    fontWeight={700}
                                    color="#333"
                                    textAlign={'center'}
                                >
                                    Money Manager
                                </Typography>
                                <Typography
                                    variant="h2"
                                    fontSize={isMobile ? '1rem' : '1.2rem'}
                                    color="#666"
                                    textAlign={'center'}
                                >
                                    Web quản lý chi tiêu
                                </Typography>
                            </Stack>

                            {/* Divider */}
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '1px',
                                    background: 'linear-gradient(90deg, transparent, #ddd, transparent)',
                                    my: 2
                                }}
                            />

                            {/* Login Section */}
                            <Stack direction={'column'} alignItems={'center'} spacing={2} width={'100%'}>
                                <Typography
                                    variant="h2"
                                    fontSize={isMobile ? '1rem' : '1.1rem'}
                                    fontWeight={600}
                                    color="#444"
                                    textAlign={'center'}
                                >
                                    Đăng nhập để tiếp tục
                                </Typography>


                                <GoogleLogin
                                    onSuccess={onSuccess}
                                    useOneTap={false}
                                    auto_select={false}
                                    theme="outline"
                                    size={isMobile ? "medium" : "large"}
                                    text="signin_with"
                                    shape="rectangular"
                                    locale="vi"
                                />

                            </Stack>

                            {/* Footer Note */}
                            <Typography
                                variant="caption"
                                color="#888"
                                textAlign={'center'}
                                sx={{ mt: isMobile ? 2 : 3 }}
                            >
                                Đăng nhập an toàn với Google
                            </Typography>
                        </Stack>
                    </Card>
                </Stack>
            </Container>
        </Box>
    );
}

export default LoginPage;
