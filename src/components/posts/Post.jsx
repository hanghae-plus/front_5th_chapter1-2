/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores";
export const Post = ({
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
  key,
}) => {
  const user = globalStore.getState().currentUser;
  const { posts } = globalStore.getState();

  const handleLikeClick = () => {
    if (!user) {
      alert("로그인 후 이용해주세요");
      return;
    }

    globalStore.setState({
      posts: [
        ...posts,
        ,
        {
          ...posts.find((post) => post.content === content),
          likeUsers: [...likeUsers, user.username],
        },
      ],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4" key={key}>
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
          onClick={handleLikeClick}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
