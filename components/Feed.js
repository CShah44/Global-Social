import InputBox from "./InputBox";
import Posts from "./Posts";

function Feed({ posts }) {
  return (
    <div className="d-flex flex-grow-1 h-screen pb-44 pt-6 mr-4">
      <div className="flex-1 mx-auto">
        <InputBox />
        <Posts posts={posts} />
      </div>
    </div>
  );
}

export default Feed;
