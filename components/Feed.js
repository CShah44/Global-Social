import InputBox from "./InputBox";
import Posts from "./Posts";

function Feed({ posts }) {
  return (
    <div className="flex-grow h-screen pb-44 pt-6 mr-4 xl:mr-40 ">
      <div className="flex-1 mx-auto max-v-md md:max-w-lg lg:max-w-2xl">
        <InputBox />
        <Posts posts={posts} />
      </div>
    </div>
  );
}

export default Feed;
