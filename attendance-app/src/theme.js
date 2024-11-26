import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Main color (blue)
    },
    secondary: {
      main: '#ff4081', // Accent color (pink)
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

export default theme;
