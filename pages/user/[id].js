import Head from "next/head";
import Header from "../../components/Header";
import ProfilePage from "../../components/Profile_Page/ProfilePage";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import UserPosts from "../../components/Profile_Page/UserPosts";
import { ToastProvider } from "react-toast-notifications";
import { Spinner } from "react-bootstrap";

export default function Profile() {
  const router = useRouter();

  const id = router.query.id;

  const [user, loading] = useCollection(db.collection("users").doc(id));

  if (loading) return <Spinner animation="border" variant="dark" />;

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito&display=swap"
          rel="stylesheet"
        />
        <title>Global Social · {user.data().name} </title>
      </Head>
      <Header />
      <ToastProvider placement="bottom-center" autoDismiss>
        <ProfilePage user={user.data()} docId={id} />
        <UserPosts user={user.data()} />
      </ToastProvider>
    </>
  );
}
