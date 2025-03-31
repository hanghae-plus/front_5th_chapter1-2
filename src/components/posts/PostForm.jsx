/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  let postContent = "";
  const handlePostSubmit = (e) => {
    globalStore.setState({
      posts: [
        ...globalStore.getState().posts,
        {
          id: globalStore.getState().posts.length + 1,
          author: globalStore.getState().currentUser.username,
          content: postContent,
          time: Date.now(),
          likeUsers: [],
        },
      ],
    });
    postContent = "";
  };

  const handlePostChange = (e) => {
    postContent = e.target.value;
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
        onChange={handlePostChange}
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handlePostSubmit}
      >
        게시
      </button>
    </div>
  );
};
