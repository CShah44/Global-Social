import Head from "next/head";
import Header from "../components/Header";
import { db, auth } from "../firebase";
import ProfilePage from "../components/Profile_Page/ProfilePage";

export default function Profile() {
  return (
    <div>
      <Head>
        <title>Global Social</title>
      </Head>
      <Header />
      <ProfilePage />
    </div>
  );
}
