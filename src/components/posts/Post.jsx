/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores";

export const Post = ({ author, time, content, likeUsers, activationLike }) => {
  const { posts, currentUser, loggedIn } = globalStore.getState();

  const likeClick = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const updatedPosts = posts.map((post) => {
      if (post.author === author) {
        const isLiked = post.likeUsers.includes(currentUser.username);
        const updateLikedUsers = isLiked
          ? post.likeUsers.filter(
              (username) => username !== currentUser.username,
            )
          : [...post.likeUsers, currentUser.username];
        return {
          ...post,
          likeUsers: updateLikedUsers,
          isLiked: !isLiked,
        };
      }
      return post;
    });

    globalStore.setState({
      posts: updatedPosts,
    });
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
          onClick={likeClick}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
