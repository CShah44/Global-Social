import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, auth } from "../../firebase";
import UserPost from "./UserPost";

function UserPosts({ posts }) {
  const [user] = useAuthState(auth);

  console.log(posts);

  const [realtimeUserPosts] = useCollection(
    db.collection("posts").where("email", "==", user.email)
  );

  return (
    <div className="scrollbar-hide mx-auto" style={{ width: "65vw" }}>
      {realtimeUserPosts
        ? realtimeUserPosts.docs.map((post) => {
            <UserPost
              key={post.id}
              id={post.id}
              name={post.data().name}
              message={post.data().message}
              email={post.data().email}
              timestamp={post.data().timestamp}
              image={post.data().image}
              postImage={post.data().postImage}
            />;
          })
        : posts?.map((post) => {
            <UserPosts
              key={post.id}
              id={post.id}
              name={post.name}
              message={post.message}
              email={post.email}
              timestamp={post.timestamp}
              image={post.image}
              postImage={post.postImage}
            />;
          })}
    </div>
  );
}

export default UserPosts;
