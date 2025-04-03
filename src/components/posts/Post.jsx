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

  const handleLike = () => {
    if (!currentUser) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const { posts } = globalStore.getState();
    const updatedPosts = posts.map((post) => {
      if (post.id !== id) return post;

      const hasLiked = post.likeUsers.includes(currentUser.name);
      const likeUsers = hasLiked
        ? post.likeUsers.filter((u) => u !== currentUser.name)
        : [...post.likeUsers, currentUser.name];

      return { ...post, likeUsers };
    });

    globalStore.setState({ posts: updatedPosts });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center mb-2">
        <div className="font-bold">{author}</div>
        <div className="text-gray-500 text-sm">{toTimeFormat(time)}</div>
      </div>
      <p>{content}</p>
      <div className="mt-2 flex justify-between text-gray-500">
        <span
          className={`like-button cursor-pointer${activationLike ? " text-blue-500" : ""}`}
          onClick={handleLike}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
