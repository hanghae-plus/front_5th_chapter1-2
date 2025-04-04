/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/globalStore.js";
import { toTimeFormat } from "../../utils/index.js";

export const Post = ({ id, author, time, content, likeUsers }) => {
  const { loggedIn, posts, currentUser } = globalStore.getState();

  // 로그인한 사용자가 좋아요 목록에 있으면 true 없으면 false
  const activationLike = currentUser
    ? likeUsers.includes(currentUser.username)
    : false;

  const handleClickEvent = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    // 좋아요 목록에 로그인한 사용자가 있으면 제거, 아니면 추가
    const newLikeUsers = activationLike
      ? likeUsers.filter((user) => user !== currentUser.username)
      : [...likeUsers, currentUser.username];

    // 좋아요 목록 포스트 상태 업데이트
    const updatedPostsLike = posts.map((post) =>
      post.id === id ? { ...post, likeUsers: newLikeUsers } : post,
    );

    globalStore.setState({ posts: updatedPostsLike });
  };

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
          className={`like-button cursor-pointer${activationLike ? " text-blue-500" : ""}`}
          onClick={handleClickEvent}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
