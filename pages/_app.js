import { Provider, useSession } from "next-auth/client";
import { db } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "../components/Login";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [session, loading] = useSession();

  if (loading) return <div>Loading</div>;
  if (!session.user) return <Login />;

  useEffect(() => {
    if (session.user) {
      db.collection("users").add(
        {
          email: session.user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: session.user.image,
        },
        { merge: true }
      );
    }
  }, [session.user]);

  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
