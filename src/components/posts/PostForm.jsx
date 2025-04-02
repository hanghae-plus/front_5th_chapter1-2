/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/index.js";

function makeNewPostState() {
  const { posts, currentUser } = globalStore.getState();
  const content = document.getElementById("post-content").value;
  return [
    {
      id: posts.length,
      author: currentUser.username,
      time: Date.now(),
      content: content,
      likeUsers: [],
    },
    ...posts,
  ];
}

export const PostForm = () => {
  function onClickSubmit(e) {
    e.preventDefault();
    globalStore.setState({
      posts: makeNewPostState(),
    });
  }
  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={onClickSubmit}
      >
        게시
      </button>
    </div>
  );
};
