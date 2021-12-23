import { useContext } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import CurrentUser from "../../contexts/CurrentUser";
import { db } from "../../firebase";
import Post from "../Post";
import { Stack } from "@mui/material";

function UserPosts({ user }) {
  const currentUser = useContext(CurrentUser);
  const email = currentUser.user.email;

  const [userPosts] = useCollection(
    db
      .collection("posts")
      .where("email", "==", user.email)
      .orderBy("timestamp", "desc")
  );

  return (
    <Stack spacing={3} sx={{ mb: 5, mx: "auto", width: "65vw" }}>
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
              postImages={post.data().postImages}
              comments={post.data().comments}
              likes={post.data().likes}
              showUserOptions={post.data().email === email ? true : false}
              repost={post.data().repost}
              uid={post.data().uid}
            />
          );
        })
      ) : (
        <p className="fs-2">No posts yet!</p>
      )}
    </Stack>
  );
}

export default UserPosts;
