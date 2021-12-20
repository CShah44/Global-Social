import { Stack } from "@mui/material";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Post from "./Post";

function Posts() {
  const [realtimePosts, loading] = useCollection(
    db.collection("posts").orderBy("timestamp", "desc")
  );

  return (
    <Stack sx={{ width: "100%" }} spacing={3}>
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
          />
        ))}
    </Stack>
  );
}

export default Posts;
