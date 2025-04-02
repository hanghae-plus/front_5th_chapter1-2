/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/globalStore";

export const PostForm = () => {
  const { posts, currentUser } = globalStore.getState();
  // 리액트라고 생각했을 때
  // onClick 한 함수 실행
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = document.getElementById("post-content").value;
    const author = currentUser.username;
    const time = Date.now();
    const likeUsers = [];

    globalStore.setState({
      posts: [
        { id: posts.length + 1, author, time, content, likeUsers },
        ...posts,
      ],
    });
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
