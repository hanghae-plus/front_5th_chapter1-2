/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/index.js";

export const PostForm = () => {
  const { createPost } = globalStore.actions;

  const handleSubmitPost = (e) => {
    const textarea = e.target.previousSibling;
    const content = textarea.value.trim();

    if (!content) {
      return;
    }

    createPost(content);
    textarea.value = "";
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
        onClick={handleSubmitPost}
      >
        게시
      </button>
    </div>
  );
};
