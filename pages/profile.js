import Head from "next/head";
import Header from "../components/Header";
// import { db, auth } from "../firebase";
import ProfilePage from "../components/Profile_Page/ProfilePage";
import UserPosts from "../components/Profile_Page/UserPosts";

export default function Profile() {
  return (
    <>
      <Head>
        <title>Global Social</title>
      </Head>
      <Header />
      <ProfilePage />
    </>
  );
}
