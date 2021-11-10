import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "Nunito",
  },
});

theme = responsiveFontSizes(theme);

export default theme;
