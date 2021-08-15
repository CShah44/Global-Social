import "bootstrap/dist/css/bootstrap.min.css";
import Login from "../components/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useEffect } from "react";
import CurrentUser from "../contexts/CurrentUser";

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
    );
  }, [user]);

  if (loading) return <div>Loading</div>;
  if (!user) return <Login />;

  const value = {
    user,
    loading,
    error,
    about: data?.about,
  };

  return (
    <CurrentUser.Provider value={value}>
      <Component {...pageProps} />
    </CurrentUser.Provider>
  );
}

export default MyApp;
