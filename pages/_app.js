import "bootstrap/dist/css/bootstrap.min.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useEffect } from "react";
import CurrentUser from "../contexts/CurrentUser";
import { Spinner } from "react-bootstrap";
import "../styles/globals.css";
import Login from "../components/Login";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../styles/createEmotionCache";
import CssBaseline from "@mui/material/CssBaseline";
// import theme from "../styles/theme";
// import { ThemeProvider } from "@mui/material/styles";

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
        .catch((e) => {
          return <Login />;
        })
    );
  }, [user]);

  if (loading) return <Spinner animation="border" variant="dark" />;
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
      <CssBaseline />
      <CurrentUser.Provider value={value}>
        <Component {...pageProps} />
      </CurrentUser.Provider>
    </CacheProvider>
  );
}

export default MyApp;
