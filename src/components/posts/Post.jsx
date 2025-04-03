/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores";

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
  const { currentUser } = globalStore.getState();
  const username = currentUser?.username;
  const isLiked = username && likeUsers.includes(username);

  const handleLikeClick = () => {
    if (!activationLike) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const newLikeUsers = [...likeUsers];
    const userIndex = newLikeUsers.indexOf(username);

    if (userIndex !== -1) {
      // 좋아요 취소
      newLikeUsers.splice(userIndex, 1);
    } else {
      // 좋아요 추가
      newLikeUsers.push(username);
    }

    // 게시물의 좋아요 목록 업데이트
    const { posts } = globalStore.getState();
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, likeUsers: newLikeUsers } : post,
    );

    globalStore.setState({ posts: updatedPosts });
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
          className={`like-button cursor-pointer${isLiked ? " text-blue-500" : ""}`}
          onClick={handleLikeClick}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
