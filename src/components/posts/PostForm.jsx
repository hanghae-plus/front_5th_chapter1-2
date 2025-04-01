/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { content } = Object.fromEntries(formData);

    const posts = globalStore.getState().posts;
    const newPost = {
      id: posts.length + 1,
      content,
      author: globalStore.getState().currentUser.username,
      time: new Date(),
      likeUsers: [],
    };

    globalStore.setState({
      posts: [newPost, ...posts],
    });
  };

  return (
    <form onSubmit={onSubmit} className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        name="content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        type="submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </form>
  );
};
