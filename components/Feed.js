import InputBox from "./InputBox";
import Posts from "./Posts";

function Feed({ posts }) {
  return (
    <div className="d-flex container-sm flex-column justify-content-center">
      <InputBox />

      <Posts posts={posts} />
    </div>
  );
}

export default Feed;
