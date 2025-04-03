/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { addPosts } = globalStore.actions;
  const { getState } = globalStore;
  const { getPosts } = globalStore.actions;
  // document.getElementById("post-submit").addEventListener("submit", (e) => {
  //   console.log('submit');
  // })

  // console.log("getPosts:", getPosts());
  const handleButtonClicked = () => {
    const text = document.getElementById("post-content").value;
    console.log("getState:", getState());
    if (text.trim() === "") {
      alert("게시물 내용을 입력해주세요.");
      return;
    }
    //  getPosts()
    // const post = {
    addPosts({
      author: getState().currentUser.username,
      content: text,
      time: Date.now(),
      likeUsers: [],
    });
    // addPosts();
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleButtonClicked}
        type="button"
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </div>
  );
};
