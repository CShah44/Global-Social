import { Provider, useSession } from "next-auth/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "../components/Login";

function MyApp({ Component, pageProps }) {
  const [session, loading] = useSession();

  if (loading) return <div>Loading</div>;
  if (!session.user) return <Login />;

  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
