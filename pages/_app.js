import "bootstrap/dist/css/bootstrap.min.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useEffect } from "react";
import CurrentUser from "../contexts/CurrentUser";
import { Spinner } from "react-bootstrap";
import "../styles/globals.css";
import Login from "../components/Login";

function MyApp({ Component, pageProps }) {
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
            data.about = snap.data().about;
            //data.followers = snap.data().followers;
            //data.following = snap.data().following;
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
    <CurrentUser.Provider value={value}>
      <Component {...pageProps} />
    </CurrentUser.Provider>
  );
}

export default MyApp;
