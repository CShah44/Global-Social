import InputBox from "./InputBox";
import Posts from "./Posts";

function Feed({ posts }) {
  return (
    <div className="d-flex container-sm ">
      <div className="flex-grow-1 w-80">
        <InputBox className="row" />

        <Posts posts={posts} className="row" />
      </div>
    </div>
  );
}

export default Feed;
