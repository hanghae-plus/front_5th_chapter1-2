/** @jsx createVNode */
import { createVNode } from "../../lib/vdom";
import { postFormHandler } from "../../lib/form";
import { ELEMENT_IDS } from "../../consts/elements";

export const PostForm = () => {
  const { handleSubmit } = postFormHandler();

  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id={ELEMENT_IDS.POST_CONTENT}
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
