import InputBox from "./InputBox";
import Posts from "./Posts";

function Feed({ posts }) {
  return (
    <div className="d-flex h-screen pt-6 me-4 container-sm">
      <div className="flex-grow-1 mx-auto">
        <InputBox />
        <Posts posts={posts} />
      </div>
    </div>
  );
}

export default Feed;
