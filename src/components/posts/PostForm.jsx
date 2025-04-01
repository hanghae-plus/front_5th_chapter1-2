/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

const CONTENT_ID = "post-content";

export const PostForm = () => {
  const onSubmit = (e) => {
    e.preventDefault();
    const content = document.getElementById(CONTENT_ID).value;
    if (!content) {
      return alert("내용을 입력해주세요");
    }
    globalStore.actions.addPost({ content });
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id={CONTENT_ID}
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        onClick={onSubmit}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </div>
  );
};
