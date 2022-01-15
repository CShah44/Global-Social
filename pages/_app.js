import "../styles/globals.css";
import Login from "../components/Login";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../styles/createEmotionCache";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "../components/Actions/useAuth";

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Login />;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Toaster position="bottom-center" />
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
