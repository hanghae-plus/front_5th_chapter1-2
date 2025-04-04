/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { posts, currentUser } = globalStore.getState();

  const updatePost = (e) => {
    const $textArea = document.getElementById("post-content");
    const content = $textArea.value;

    e.preventDefault();
    const newPost = {
      id: posts.length + 1,
      author: currentUser,
      time: Date.now(),
      content: content.trim(),
      likeUsers: [],
    };

    globalStore.setState({
      posts: [newPost, ...posts],
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
        onClick={updatePost}
      >
        게시
      </button>
    </div>
  );
};
