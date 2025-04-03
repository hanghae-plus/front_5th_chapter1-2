/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/globalStore.js";

export const PostForm = () => {
  const { post } = globalStore.actions;

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
        onClick={(e) => {
          e.preventDefault();
          const content = document.querySelector("#post-content").value;
          post(content);
        }}
      >
        게시
      </button>
    </div>
  );
};
