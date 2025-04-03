/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { loggedIn } = globalStore.getState();

  const handleAddPost = () => {
    const $textArea = document.getElementById("post-content");
    const content = $textArea.value;

    if (!content || content.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }

    if (!loggedIn) {
      alert("로그인 후 이용해주세요.");
      return;
    } else {
      globalStore.actions.addPost(content);
      $textArea.value = "";
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
        onClick={handleAddPost}
      >
        게시
      </button>
    </div>
  );
};
