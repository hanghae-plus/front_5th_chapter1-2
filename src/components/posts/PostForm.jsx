/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { currentUser, posts } = globalStore.getState();
  let content = "";
  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
        onChange={(e) => {
          content = e.target.value;
        }}
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          globalStore.setState({
            posts: [
              ...posts,
              {
                id: posts.length + 1,
                author: currentUser.username,
                time: Date.now(),
                content,
                likeUsers: [],
              },
            ],
          });
        }}
      >
        게시
      </button>
    </div>
  );
};
