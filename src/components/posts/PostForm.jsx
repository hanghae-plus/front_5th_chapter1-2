/** @jsx createVNode */
import { createVNode } from "../../lib/vdom";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const currentUser = globalStore.getState().currentUser;

  const handleSubmit = (e) => {
    e.preventDefault();

    const content = document.getElementById("post-content").value;

    const post = {
      id: globalStore.getState().posts.length + 1,
      author: currentUser.username,
      time: Date.now(),
      content,
      likeUsers: [],
    };

    globalStore.setState({
      posts: [...globalStore.getState().posts, post],
    });

    document.getElementById("post-content").value = "";
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
