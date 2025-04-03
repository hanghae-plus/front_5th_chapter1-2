/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores";
// import { changeFavorite } from "../../stores";

export const Post = ({
  author,
  time,
  content,
  likeUsers,
  activationLike,
  id,
}) => {
  const { loggedIn } = globalStore.getState();
  const { changeFavorite } = globalStore.actions;
  // let activationLike = false;
  const handleButtonClick = () => {
    if (loggedIn) {
      changeFavorite(id);
    } else if (!loggedIn) {
      alert("로그인 후 이용해주세요");
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
          onClick={() => handleButtonClick()}
          className={`like-button cursor-pointer${likeUsers.length > 0 ? " text-blue-500" : ""}`}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
