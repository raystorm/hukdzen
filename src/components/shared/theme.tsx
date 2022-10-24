import { createTheme, ThemeProvider } from '@mui/material/styles';
import { enUS as CoreEnUS } from '@mui/material/locale';
import { CalendarPicker, LocalizationProvider, enUS } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import enUSLocale from 'date-fns/esm/locale/en-US/index.js';

export const theme = createTheme({
  typography: {
    button: { textTransform: 'none' }
  },
  palette: {
    primary:   { main: '#222222', },
    secondary: { main: '#af0000', },
  },
},
enUS,
CoreEnUS,
);

/*
<ThemeProvider theme={theme}>
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={enUSLocale}>
    <CalendarPicker />
  </LocalizationProvider>
</ThemeProvider>;
*/ 