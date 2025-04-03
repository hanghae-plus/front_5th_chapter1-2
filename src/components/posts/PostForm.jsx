/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { loggedIn } = globalStore.getState();
  const { posts } = globalStore.getState();
  const handlePostSubmit = (e) => {
    const textarea = document.getElementById("post-content");
    const content = textarea.value.trim();

    const newPost = {
      id: posts.length + 1,
      author: globalStore.getState().currentUser.username,
      time: Date.now(),
      content,
      likeUsers: [],
    };

    // 기존 posts에 새 게시물 추가
    const updatedPosts = [...posts, newPost];

    // globalStore 업데이트
    globalStore.setState({ posts: updatedPosts });

    // textarea 초기화
    textarea.value = "";
  };

  return loggedIn ? (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onclick={handlePostSubmit}
      >
        게시
      </button>
    </div>
  ) : null;
};
