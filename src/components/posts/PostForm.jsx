/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { currentUser, posts } = globalStore.getState();

  function postSubmit() {
    // newPost 세팅
    const id = posts.length + 1;
    const author = currentUser.username;
    const time = Date.now();
    const content = document.querySelector("textarea").value;
    const likeUsers = [];

    const currentPost = [...posts];
    const newPost = { id, author, time, content, likeUsers };
    currentPost.unshift(newPost);
    globalStore.setState({
      posts: currentPost,
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
        onClick={postSubmit}
      >
        게시
      </button>
    </div>
  );
};
