import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, auth } from "../../firebase";
import UserPost from "./UserPost";

function UserPosts() {
  const [user] = useAuthState(auth);

  const [userPosts] = useCollection(
    db.collection("posts").where("email", "==", user.email)
  );

  // console.log(realtimeUserPosts.docs);

  return (
    <div className="scrollbar-hide mx-auto" style={{ width: "65vw" }}>
      {userPosts &&
        userPosts.docs.map((post) => {
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
        })}
    </div>
  );
}

export default UserPosts;
