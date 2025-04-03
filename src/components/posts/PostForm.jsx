/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  //04.04 주석처리
  //onClick에서 handleClick 할당시 Dom에서 이를 html로 인식. 왜?

  // const handlePost = (e) => {
  //   e.preventDefault();
  //   const oldPost = globalStore.getState().posts;

  //   const newPost = {
  //     id: oldPost.length + 1,
  //     author: globalStore.getState().currentUser.username,
  //     time: Date.now(),
  //     content: document.getElementById("post-content").value,
  //     likeUsers: [],
  //   };

  //   const posts = [...oldPost, newPost];
  //   globalStore.setState({ posts });
  // };

  const { loggedIn } = globalStore.getState();
  const { post } = globalStore.actions;

  if (!loggedIn) {
    return;
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
        onClick={(e) => {
          e.preventDefault();
          const content = document.querySelector("#post-content").value;
          post(content);
        }}
      >
        게시
      </button>
    </div>
  );
};
