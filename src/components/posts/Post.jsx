/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";
import { toTimeFormat } from "../../utils/index.js";

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
  const { currentUser, loggedIn } = globalStore.getState();

  const handleLikeClick = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }
    const prev = globalStore.getState();
    const { posts, ...rest } = prev;
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    if (!likeUsers.includes(currentUser.username))
      post.likeUsers.push(currentUser.username);
    else post.likeUsers = likeUsers.filter((u) => u !== currentUser.username);
    globalStore.setState({ ...rest, posts: [...posts] });
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
