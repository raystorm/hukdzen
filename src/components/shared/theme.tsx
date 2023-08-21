import { createTheme, } from '@mui/material/styles';
import { enUS as CoreEnUS } from '@mui/material/locale';
import { enUS } from '@mui/x-date-pickers';

export const theme = createTheme({
  typography: {
    button: { textTransform: 'none' }
  },
  palette: {
    primary:   { main: '#222222', },
    secondary: { main: '#af0000', },
    contrast:  
    { 
      light: '#fff', 
      main: '#fff', 
      dark: '#778899', 
      contrastText: '#000'
    },
  },
},
enUS,
CoreEnUS,
);