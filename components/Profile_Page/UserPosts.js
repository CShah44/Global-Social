import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { collection, where, orderBy, query } from "firebase/firestore";
import Post from "../Post";
import { Stack, Typography } from "@mui/material";

function UserPosts({ user }) {
  const email = user.email;

  const [userPosts] = useCollection(
    query(
      collection(db, "posts"),
      where("email", "==", email),
      orderBy("timestamp", "desc")
    )
  );

  return (
    <Stack
      spacing={3}
      sx={{ my: 5, mx: "auto", width: { xs: "100vw", md: "650px" } }}
    >
      <Typography variant="h5">Posts</Typography>
      {userPosts && userPosts?.docs.length > 0 ? (
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
