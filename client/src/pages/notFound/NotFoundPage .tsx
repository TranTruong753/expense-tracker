import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';

function NotFoundPage() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/"); 
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                color: 'white',
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h1" fontWeight="bold" gutterBottom>
                            404
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            Ối! Bạn lạc đường rồi.
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Rất tiếc, trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tạm thời không truy cập được.
                        </Typography>

                        <Button
                            variant="contained"
                            color="inherit"
                            size="large"
                            startIcon={<HomeIcon />}
                            onClick={handleGoBack}
                            sx={{
                                color: '#764ba2',
                                fontWeight: 'bold',
                            }}
                        >
                            Về Trang Chủ
                        </Button>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <img
                            src="/img/not-found.jpg"
                            alt="404 Error - Page not found"
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '8px'
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default NotFoundPage;