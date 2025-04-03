/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

function addPost(content) {
  const { posts } = globalStore.getState();
  const { currentUser } = globalStore.getState();

  const post = {
    id: posts.length + 1,
    author: currentUser.username,
    time: Date.now(),
    content,
    likeUsers: [], // 각 포스트의 likeUsers 배열을 빈 배열로 초기화
  };

  globalStore.setState({
    posts: [...posts, post],
  });
}

export const PostForm = () => {
  const handleSubmitPost = (e) => {
    e.preventDefault();
    const postContents = document.getElementById("post-content").value || "";
    if (postContents) {
      addPost(postContents);
    }
  };
  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
        key
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={(e) => handleSubmitPost(e)}
      >
        게시
      </button>
    </div>
  );
};
