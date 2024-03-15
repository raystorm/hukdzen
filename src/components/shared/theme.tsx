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
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '0.25em',
          display: 'block',
          //width: '98%',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          width: '98%',
          margin: '0.25em',
          //display: 'block',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          //width: 'initial',
        }
      }
    }
  },
},
enUS,
CoreEnUS,
);