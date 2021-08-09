import InputBox from "./InputBox";
import Posts from "./Posts";

function Feed() {
  return (
    <div className="d-flex container-sm flex-column justify-content-center">
      <InputBox />

      <Posts />
    </div>
  );
}

export default Feed;
