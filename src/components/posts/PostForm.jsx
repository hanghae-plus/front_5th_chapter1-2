/** @jsx createVNode */
import { createStore, createVNode } from "@/lib";
import { globalStore } from "@/stores";

export const PostForm = () => {
  const { getState, setState } = createStore({ content: "" }, []);

  const handleChange = (e) => {
    setState({ content: e.target.value });
  };

  const handleSubmit = (e) => {
    const { posts, ...rest } = globalStore.getState();
    const { content } = getState();
    const post = {
      id: posts.length + 1,
      author: rest.currentUser.username,
      time: Date.now(),
      content,
      likeUsers: [],
    };
    globalStore.setState({ ...rest, posts: [...posts, post] });
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
        value={getState()?.content || ""}
        onChange={handleChange}
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
