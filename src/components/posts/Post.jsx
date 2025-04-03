/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores";
import { userStorage } from "../../storages";

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  isLoggedIn = false,
}) => {
  const currentUser = userStorage.get();

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const { posts } = globalStore.getState();
    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        const username = currentUser?.username || 'testuser';
        const userIndex = post.likeUsers.indexOf(username);
        const updatedLikeUsers =
          userIndex >= 0
            ? post.likeUsers.filter((_, index) => index !== userIndex)
            : [...post.likeUsers, username];
        return { ...post, likeUsers: updatedLikeUsers };
      }
      return post;
    });

    globalStore.setState({ posts: updatedPosts });
  };

  const username = currentUser?.username || 'testuser';
  const isLiked = likeUsers?.includes(username);
  const className = `like-button cursor-pointer${isLiked ? " text-blue-500" : ""}`;

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
        <span onClick={handleLikeClick} className={className}>
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
