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

  let data = {};

  useEffect(() => {
    if (
      db
        .collection("users")
        .doc(user?.uid)
        .get()
        .then((snap) => {
          if (snap.exists) {
            return (data.about = snap.data().about);
          }

          if (user) {
            db.collection("users").doc(user.uid).set(
              {
                name: user.displayName,
                about: "Hey there, I am using Global Social!",
                email: user.email,
                followers: [],
                following: [],
                photoURL: user.photoURL,
              },
              { merge: true }
            );
          }
        })
        .catch(() => {
          return <Login />;
        })
    );
  }, [user]);

  if (loading) return null;
  if (!user) return <Login />;

  const value = user
    ? {
        user,
        loading,
        error,
        about: data?.about,
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
