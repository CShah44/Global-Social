import Head from "next/head";
import Header from "../../components/Header";
import ProfilePage from "../../components/Profile_Page/ProfilePage";
import { Fragment } from "react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";

export default function Profile() {
  const router = useRouter();

  const id = router.query.id;

  const [user, loading] = useCollection(db.collection("users").doc(id));

  if (loading) return <p>LOADING</p>;

  return (
    <Fragment>
      <Head>
        <title>Global Social · {user.data().name} </title>
      </Head>
      <Header />
      <ProfilePage user={user.data()} />
    </Fragment>
  );
}
