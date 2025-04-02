/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const handlePostSubmit = (e) => {
    e.preventDefault();
    const prevPosts = globalStore.getState().posts;

    const newPost = {
      id: prevPosts.length + 1,
      author: globalStore.getState().currentUser.username,
      time: Date.now(),
      content: document.getElementById("post-content").value,
      likeUsers: [],
    };

    const posts = [...prevPosts, newPost];
    globalStore.setState({ posts });
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
        onClick={handlePostSubmit}
      >
        게시
      </button>
    </div>
  );
};
