/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { posts, currentUser } = globalStore.getState();

  function onSubmitPost(e) {
    e.preventDefault();
    const content = document.getElementById("post-content").value;
    const author = currentUser.username;

    globalStore.setState({
      posts: [
        ...posts,
        {
          id: posts.length + 1,
          author,
          time: new Date(),
          content,
          likeUsers: [],
        },
      ],
    });
  }

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
        onclick={onSubmitPost}
      >
        게시
      </button>
    </div>
  );
};
