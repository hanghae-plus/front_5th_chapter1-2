/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { currentUser } = globalStore.getState();
  const { createPost } = globalStore.actions;

  const handleSubmitPost = (e) => {
    e.preventDefault();
    const content = document.getElementById("post-content").value;
    createPost({ content });
    document.getElementById("post-content").value = "";
  };

  return (
    <form
      className="mb-4 bg-white rounded-lg shadow p-4"
      onSubmit={handleSubmitPost}
    >
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        type="submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </form>
  );
};
