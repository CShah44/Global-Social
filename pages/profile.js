import Head from "next/head";
import Header from "../components/Header";
import { db, auth } from "../firebase";
import ProfilePage from "../components/Profile_Page/ProfilePage";
import Login from "../components/Login";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Profile() {
  const [user] = useAuthState(auth);

  const posts = db.collection("posts").where("email", "==", user.email).get();

  const docs = posts.docs?.map((post) => ({
    id: post.id,
    ...post.data(),
    timestamp: null,
  }));

  return (
    <div>
      <Head>
        <title>Global Social</title>
      </Head>
      <Header />
      <ProfilePage posts={docs ? docs : []} />
    </div>
  );
}

// export async function getServerSideProps() {

//   return {
//     props: {
//       posts: docs,
//     },
//   };
// }
