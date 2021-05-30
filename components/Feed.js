import InputBox from "./InputBox";
import Posts from "./Posts";

function Feed({ posts }) {
  return (
    <div className="d-flex container-sm">
      <div className="flex-grow-1">
        <div className="row">
          <InputBox />
        </div>
        <div className="row">
          <Posts posts={posts} />
        </div>
      </div>
    </div>
  );
}

export default Feed;
