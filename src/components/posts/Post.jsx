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
  const { currentUser, posts, loggedIn } = globalStore.getState();

  const handleLikeClick = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const newPosts = posts.map((post) => {
      if (post.id === id) {
        const likes = post.likeUsers;
        const currentUsername = currentUser.username;

        if (likes.includes(currentUsername)) {
          return {
            ...post,
            likeUsers: likes.filter((username) => username !== currentUsername),
          };
        } else {
          return {
            ...post,
            likeUsers: [...likes, currentUsername],
          };
        }
      }
      return post;
    });

    globalStore.setState({
      posts: newPosts,
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
          onclick={handleLikeClick}
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
