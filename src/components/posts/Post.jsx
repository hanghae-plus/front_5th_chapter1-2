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
  const { currentUser, loggedIn, posts } = globalStore.getState();

  const onLikeToggle = () => {
    if (!loggedIn) {
      return alert("로그인 후 이용해주세요");
    } else {
      const newPosts = [...posts].map((post) => {
        if (post.id === id) {
          if (post.likeUsers.includes(currentUser.username)) {
            return {
              ...post,
              likeUsers: likeUsers.filter((it) => it !== currentUser.username),
            };
          } else {
            return {
              ...post,
              likeUsers: [...likeUsers, currentUser.username],
            };
          }
        }
        return post;
      });

      console.log(newPosts);
      globalStore.setState({
        posts: newPosts,
      });
    }
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
          onClick={onLikeToggle}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
