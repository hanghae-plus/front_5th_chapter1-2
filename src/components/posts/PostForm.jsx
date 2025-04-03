/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

function updateNewPost(newPostContent) {
  // console.log('new post');
  // console.log(newPostContent);
  // console.log(globalStore.getState().currentUser.username)

  const currentState = globalStore.getState();

  const newId =
    currentState.posts.length > 0
      ? Math.max(...currentState.posts.map((post) => post.id)) + 1
      : 1; // 기존에 게시물이 없으면 id는 1부터 시작

  const newPost = {
    id: newId,
    author: globalStore.getState().currentUser.username, // 현재 로그인한 아이디명
    time: Date.now(),
    content: newPostContent,
    likeUsers: [],
  };

  // 기존 posts 배열에 새로운 게시물 추가
  const updatedPosts = [...currentState.posts, newPost];

  // globalStore의 상태 업데이트
  globalStore.setState({
    posts: updatedPosts,
  });
}

export const PostForm = () => {
  const { loggedIn } = globalStore.getState();
  if (!loggedIn) return null;

  let newPost = "";

  const handleChange = (event) => {
    newPost = event.target.value;
  };

  const writePost = (event) => {
    event.preventDefault();
    updateNewPost(newPost);
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
        oninput={handleChange}
      ></textarea>
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onclick={writePost}
      >
        게시
      </button>
    </div>
  );
};

// export const PostForm = () => {
//   return createVNode(
//     "div",
//     { className: "mb-4 bg-white rounded-lg shadow p-4" },
//     createVNode(
//       "textarea",
//       {
//         id: "post-content",
//         placeholder: "무슨 생각을 하고 계신가요?",
//         className: "w-full p-2 border rounded",
//       }
//     ),
//     createVNode(
//       "button",
//       {
//         id: "post-submit",
//         className: "mt-2 bg-blue-600 text-white px-4 py-2 rounded",
//       },
//       "게시"
//     )
//   );
// };

// 멘토링 : 자식이 없다면 null 명시.
