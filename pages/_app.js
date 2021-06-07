import { Provider, useSession } from "next-auth/client";
import { db } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "../components/Login";
import { useEffect } from "react";
import firebase from "firebase";

function MyApp({ Component, pageProps }) {
  const [session, loading] = useSession();

  const user = session && session.user;

  useEffect(() => {
    if (user) {
      const usersRef = db.collection("users");
      const usersSnapshot = usersRef.where("email", "==", user?.email).get();

      if (usersSnapshot.empty) {
        db.collection("users").add(
          {
            email: session.user.email,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: session.user.image,
          },
          { merge: true }
        );
        return;
      }
    }
  }, [user]);

  // if (loading) return <div>Loading</div>;
  if (!user) return <Login />;

  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
