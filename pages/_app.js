import "bootstrap/dist/css/bootstrap.min.css";
import Login from "../components/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading</div>;
  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
