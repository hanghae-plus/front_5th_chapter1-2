/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/globalStore.js";
import { toTimeFormat } from "../../utils/index.js";

export const Post = ({
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
  id,
}) => {
  const { loggedIn, currentUser } = globalStore.getState();

  const handleLike = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    } else {
      globalStore.setState({
        ...globalStore.getState(),
        posts: globalStore.getState().posts.map((post) => {
          if (post.id === id) {
            const updatedLikeUsers = activationLike
              ? post.likeUsers.filter((user) => user !== currentUser.username)
              : [...post.likeUsers, currentUser.username];

            return {
              ...post,
              likeUsers: updatedLikeUsers,
            };
          }
          return post;
        }),
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
