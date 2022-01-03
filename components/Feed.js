import { Stack, CircularProgress } from "@mui/material";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Post from "./Post";

function Feed() {
  const [realtimePosts, loading] = useCollection(
    db.collection("posts").orderBy("timestamp", "desc")
  );

  return (
    <>
      <Stack
        sx={{
          width: { xs: "100vw", sm: "500px", md: "650px" },
          my: "3em",
          mx: "auto",
        }}
        spacing={1}
      >
        {loading && <CircularProgress />}
        {realtimePosts &&
          realtimePosts?.docs.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              name={post.data().name}
              message={post.data().message}
              email={post.data().email}
              timestamp={post.data().timestamp}
              image={post.data().image}
              comments={post.data().comments}
              likes={post.data().likes}
              showDeleteButton={false}
              repost={post.data().repost}
              uid={post.data().uid}
              postImages={post.data().postImages}
            />
          ))}
      </Stack>
    </>
  );
}

export default Feed;
