import UserPost from "./UserPost";

function UserPosts({ posts }) {
  return (
    <div className="scrollbar-hide mx-auto" style={{ width: "65vw" }}>
      {posts &&
        posts.map((post) => {
          <UserPost
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
