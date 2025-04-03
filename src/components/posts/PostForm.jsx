/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";
import { userStorage } from "../../storages";

export const PostForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = document.getElementById("post-content").value;
    if (!content.trim()) return;

    const currentUser = userStorage.get();
    const newPost = {
      id: Date.now(),
      author: currentUser.username,
      time: Date.now(),
      content: content,
      likeUsers: [],
    };

    const { posts } = globalStore.getState();
    globalStore.setState({
      posts: [newPost, ...posts],
    });

  
    document.getElementById("post-content").value = "";
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
        onClick={handleSubmit}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </div>
  );
};
