import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import Post from "../Post";

function UserPosts({ user }) {
  const [userPosts] = useCollection(
    db.collection("posts").where("email", "==", user.email)
  );

  return (
    <div className="scrollbar-hide mx-auto mb-5 " style={{ width: "65vw" }}>
      {userPosts && userPosts.docs.length > 0 ? (
        userPosts.docs.map(function (post) {
          return (
            <Post
              key={post.id}
              id={post.id}
              name={post.data().name}
              message={post.data().message}
              email={post.data().email}
              timestamp={post.data().timestamp}
              image={post.data().image}
              postImage={post.data().postImage}
              comments={post.data().comments}
              likes={post.data().likes}
              showUserOptions={post.data().email === user.email ? true : false}
              repost={post.data().repost}
              uid={post.data().uid}
            />
          );
        })
      ) : (
        <p className="fs-2">No posts yet!</p>
      )}
    </div>
  );
}

export default UserPosts;
