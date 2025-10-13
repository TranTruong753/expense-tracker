import { Box, Card, Container, Stack, Typography } from "@mui/material";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import AddCardIcon from '@mui/icons-material/AddCard';
import { apiGoogleLogin } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@toolpad/core";
import React from "react";
import { getAccessToken, setAccessToken } from "../../services/tokenService";

function LoginPage() {

    const navigate = useNavigate();

    const notifications = useNotifications()

    const onSuccess = async (credentialResponse: CredentialResponse) => {
        const idToken = credentialResponse.credential;

        if (!idToken) return

        try {
            const { redirectTo, token } = await apiGoogleLogin(idToken)

            if(token) setAccessToken(token)

            navigate(redirectTo)
        } catch  {
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
                            maxWidth: '90vw',
                            px: 4,
                            py: 5,
                            borderRadius: 3,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        <Stack
                            direction={'column'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            spacing={3}
                        >
                            {/* Logo/Icon Section */}
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2
                                }}
                            >
                                <AddCardIcon fontSize="large" sx={{ color: 'white' }} />

                            </Box>

                            {/* Title Section */}
                            <Stack direction={'column'} alignItems={'center'} spacing={1}>
                                <Typography
                                    variant="h1"
                                    fontSize={'28px'}
                                    fontWeight={700}
                                    color="#333"
                                    textAlign={'center'}
                                >
                                    Money Manager
                                </Typography>
                                <Typography
                                    variant="body1"
                                    fontSize={'16px'}
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
                                    fontSize={'18px'}
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
                                    size="large"
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
                                sx={{ mt: 3 }}
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
