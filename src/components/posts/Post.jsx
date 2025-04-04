/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores";
export const Post = ({ author, time, id, content, likeUsers }) => {
  const { loggedIn, currentUser, posts } = globalStore.getState();
  const isActivationLike = likeUsers.includes(currentUser?.username);

  const isLiked = (e) => {
    e.preventDefault();
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    globalStore.setState({
      posts: posts.map((post) => {
        if (post.id === id) {
          const isAlreadyLiked = post.likeUsers.includes(currentUser.username);
          return {
            ...post,
            likeUsers: isAlreadyLiked
              ? post.likeUsers.filter(
                  (username) => username !== currentUser.username,
                )
              : [...post.likeUsers, currentUser.username],
          };
        }
        return post;
      }),
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
          onClick={isLiked}
          className={`like-button cursor-pointer${isActivationLike ? " text-blue-500" : ""}`}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
