import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
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
import { useState } from "react";

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // TODO CHECK THIS
  // const [user, loading, error] = useAuthState(auth);
  const [user, setUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      setUser(user);

      const userDoc = getDoc(doc(db, "users", user.uid));

      userDoc.then((doc) => {
        if (!doc.exists) {
          setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            about: "Hey there, I am using Global Social!",
            email: user.email,
            photoURL: user.photoURL,
          });
        }
      });
    });

    return () => unsub();
  }, []);

  const value = user
    ? {
        user,
      }
    : {};

  if (!user) return <Login />;

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
