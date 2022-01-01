import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "Satoshi, Expose, sans-serif",
  },
});

theme = responsiveFontSizes(theme);

export default theme;
