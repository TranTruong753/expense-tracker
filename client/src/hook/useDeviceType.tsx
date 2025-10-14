import { useTheme, useMediaQuery } from '@mui/material';

type Device = 'mobile' | 'tablet' | 'desktop';

export const useDeviceType = (deviceToCheck: Device): boolean => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  switch (deviceToCheck) {
    case 'mobile':
      return isMobile;
    case 'tablet':
      return isTablet;
    case 'desktop':
      return isDesktop;
    default:
      return false;
  }
};
