import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Post from "./Post";

function Posts({ posts }) {
  const [realtimePosts] = useCollection(
    db.collection("posts").orderBy("timestamp", "desc")
  );

  return (
    <div className="scrollbar-hide mx-auto" style={{ width: "65vw" }}>
      {realtimePosts
        ? realtimePosts?.docs.map((post) => (
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
              showDeleteButton={false}
            />
          ))
        : posts.map((post) => {
            <Post
              key={post.id}
              id={post.id}
              name={post.name}
              message={post.message}
              email={post.email}
              timestamp={post.timestamp}
              image={post.image}
              likes={post.likes}
              comments={post.comments}
              postImage={post.postImage}
              showDeleteButton={false}
            />;
          })}
    </div>
  );
}

export default Posts;
