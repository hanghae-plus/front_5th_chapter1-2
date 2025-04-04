/** @jsx createVNode */
import { createVNode } from "../../lib";
import { ERROR_MESSAGES } from "../../errors";

export const PostForm = ({ addPost }) => {
  const handleSubmitClick = () => {
    const $textarea = document.getElementById("post-content");
    const content = $textarea?.value?.trim();

    if (!content) {
      alert(ERROR_MESSAGES.CONTENT_EMPTY);
      return;
    }

    const state = addPost(content);

    if (state.error) {
      alert(state.error.message);
      return;
    }

    $textarea.value = "";
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
        onClick={handleSubmitClick}
      >
        게시
      </button>
    </div>
  );
};
