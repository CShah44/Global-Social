import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useEffect } from "react";
import CurrentUser from "../contexts/CurrentUser";
import "../styles/globals.css";
import Login from "../components/Login";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../styles/createEmotionCache";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              return;
            } else {
              db.collection("users").doc(user.uid).set(
                {
                  name: user.displayName,
                  about: "Hey there, I am using Global Social!",
                  email: user.email,
                  photoURL: user.photoURL,
                },
                { merge: true }
              );
            }
          });
      } else {
        return <Login />;
      }
    });
  }, []);

  if (loading) return null;
  if (!user) return <Login />;

  const value = user
    ? {
        user,
        loading,
        error,
      }
    : {};

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CurrentUser.Provider value={value}>
          <Toaster position="bottom-center" />
          <Component {...pageProps} />
        </CurrentUser.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
