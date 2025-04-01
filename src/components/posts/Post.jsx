/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores/index.js";

function likePost(postId, user) {
  const { posts } = globalStore.getState();

  const newPosts = posts.map((post) => {
    if (post.id !== postId) return post;

    if (post.likeUsers.includes(user.username)) {
      const likeUsers = post.likeUsers.filter(
        (likeUser) => likeUser !== user.username,
      );

      return { ...post, likeUsers };
    }

    return {
      ...post,
      likeUsers: [...post.likeUsers, user.username],
    };
  });

  globalStore.setState({
    posts: [...newPosts],
  });
}

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
  const { loggedIn, currentUser } = globalStore.getState();

  const handleClickLike = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    likePost(id, currentUser);
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
          onClick={handleClickLike}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
