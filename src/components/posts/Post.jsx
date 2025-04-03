/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores";

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers = [],
  activationLike = false,
}) => {
  const { loggedIn, currentUser, posts } = globalStore.getState();
  const { toggleLikePost } = globalStore.actions;

  const handleLike = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }
    toggleLikePost(id);
    // const post = posts.find(post => post.id === id);
    // console.log("likeUsers", likeUsers);
    // console.log("Updated activationLike:", post.activationLike); // 상태 변경 확인
  };
  // 상태가 바뀐 후에 값을 출력
  // console.log("likeUsers", likeUsers);
  // console.log("activationLike", activationLike)

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center mb-2">
        <div>
          <div className="font-bold">{author}</div>
          <div className="text-gray-500 text-sm">{toTimeFormat(time)}</div>
        </div>
      </div>
      <p>{content}</p>
      <div className="mt-2 flex justify-between text-gray-500">
        <span
          onClick={handleLike}
          className={`like-button cursor-pointer${activationLike ? " text-blue-500" : ""}`}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
