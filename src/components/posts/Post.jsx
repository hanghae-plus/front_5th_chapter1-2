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
  const { loggedIn, currentUser, posts } = globalStore.getState();
  const isLiked = currentUser && likeUsers.includes(currentUser.username);

  const handleLikeClick = (e) => {
    e.preventDefault();

    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const post = posts.find((post) => post.id === id);

    if (post.likeUsers.includes(currentUser.username)) {
      post.likeUsers = post.likeUsers.filter(
        (user) => user !== currentUser.username,
      );
    } else {
      post.likeUsers.push(currentUser.username);
    }

    globalStore.setState({ posts });
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
