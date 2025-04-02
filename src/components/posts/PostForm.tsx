/** @jsx createVNode */
import { createVNode } from "../../lib/vdom";
import { userStore, postStore } from "../../stores";

export const PostForm = () => {
  const currentUser = userStore.getState().currentUser;
  const { posts } = postStore.getState();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!currentUser) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const contentElement = document.getElementById(
      "post-content",
    ) as HTMLTextAreaElement;
    const content = contentElement.value;

    const post = {
      id: posts.length + 1,
      author: currentUser.username,
      time: Date.now(),
      content,
      likeUsers: [],
    };

    postStore.setState({
      posts: [...posts, post],
    });

    contentElement.value = "";
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
