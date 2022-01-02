import Head from "next/head";
import ProfilePage from "../../components/Profile_Page/ProfilePage";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import UserPosts from "../../components/Profile_Page/UserPosts";
import Navbar from "../../components/NavBar";
import { CircularProgress, Stack } from "@mui/material";

export default function Profile() {
  const router = useRouter();

  const id = router.query.id;

  const [user, loading] = useCollection(db.collection("users").doc(id));

  if (loading) return <CircularProgress />;

  return (
    <>
      <Head>
        <title>Global Social · {user.data().name} </title>
      </Head>
      <Stack>
        <Navbar />
        <ProfilePage user={user.data()} docId={id} />
        <UserPosts user={user.data()} />
      </Stack>
    </>
  );
}
