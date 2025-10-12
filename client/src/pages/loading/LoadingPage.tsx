import { Box, Typography, CircularProgress } from '@mui/material';

const LoadingPage = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.paper',
        zIndex: 9999,
      }}
    >

      <CircularProgress 
        size={60}       
        thickness={4}    
        sx={{ mb: 2 }}  
      />
      
   
      <Typography variant="h6" component="div">
        Web Quản Lý Chi Tiêu
      </Typography>
    </Box>
  );
};

export default LoadingPage;