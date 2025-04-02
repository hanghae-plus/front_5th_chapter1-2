/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores";

export const Post = ({ id, author, time, content, likeUsers = [] }) => {
  const { currentUser, loggedIn } = globalStore.getState();

  const handleLike = () => {
    if (!loggedIn) {
      window.alert("로그인 후 이용해주세요");
      return;
    }

    const { posts } = globalStore.getState();
    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        const isLiked = post.likeUsers?.includes(currentUser.id);
        return {
          ...post,
          likeUsers: isLiked
            ? post.likeUsers.filter((userId) => userId !== currentUser.id)
            : [...(post.likeUsers || []), currentUser.id],
        };
      }
      return post;
    });

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
          className={`like-button cursor-pointer${
            likeUsers?.includes(currentUser?.id) ? " text-blue-500" : ""
          }`}
          onClick={handleLike}
        >
          좋아요 {likeUsers?.length || 0}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
