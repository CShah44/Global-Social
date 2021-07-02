import "bootstrap/dist/css/bootstrap.min.css";
import Login from "../components/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
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
  }, [user]);

  if (loading) return <div>Loading</div>;
  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
