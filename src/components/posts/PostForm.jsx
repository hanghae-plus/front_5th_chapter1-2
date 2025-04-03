/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { loggedIn } = globalStore.getState();
  const { createPost } = globalStore.actions;

  /**
   * @description 로그인된 상태에서만 게시글을 쓸 수 있다.
   */
  const onUpload = () => {
    const content = document.getElementById("post-content").value;
    if (loggedIn) {
      createPost(content);
    } else {
      alert("로그인 후 이용해주세요");
    }
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
        onClick={onUpload}
      >
        게시
      </button>
    </div>
  );
};
