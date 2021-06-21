import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, auth } from "../../firebase";
import UserPost from "./UserPost";

function UserPosts() {
  const [user] = useAuthState(auth);

  const [userPosts] = useCollection(
    db.collection("posts").where("email", "==", user.email)
  );

  return (
    <div className="scrollbar-hide mx-auto mb-5 " style={{ width: "65vw" }}>
      {userPosts?.docs?.length > 0 ? (
        userPosts.docs.map(function (post) {
          return (
            <UserPost
              key={post.id}
              id={post.id}
              name={post.data().name}
              message={post.data().message}
              email={post.data().email}
              timestamp={post.data().timestamp}
              image={post.data().image}
              postImage={post.data().postImage}
            />
          );
        })
      ) : (
        <p className="fs-2">You have no posts yet!</p>
      )}
    </div>
  );
}

export default UserPosts;
