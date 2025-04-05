/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";
export const PostForm = () => {
  const user = globalStore.getState().currentUser;
  const posts = globalStore.getState().posts;
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = document.getElementById("post-content").value;
    globalStore.setState({
      posts: [
        ...posts,
        {
          id: posts.length + 1,
          content,
          author: user.username,
          time: Date.now(),
          likeUsers: [],
        },
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
