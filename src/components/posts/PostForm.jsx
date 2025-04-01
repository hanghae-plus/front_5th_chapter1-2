/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";
const postForm = (content) => {
  const { currentUser, posts } = globalStore.getState();
  const post = {
    id: posts.length + 1,
    author: currentUser.username,
    content: content,
    likeUsers: [],
    time: Date.now(),
  };
  globalStore.setState({ posts: [...posts, post] });
};

export const PostForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = document.getElementById("post-content").value;
    postForm(content);
  };
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
        onClick={handleSubmit}
      >
        게시
      </button>
    </div>
  );
};
