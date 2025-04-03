/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/globalStore.js";
import { toTimeFormat } from "../../utils/index.js";

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
  const { loggedIn, currentUser, posts } = globalStore.getState();

  const onClickLike = () => {
    if (!loggedIn) {
      return alert("로그인 후 이용해주세요");
    }

    globalStore.setState({
      posts: posts.map((post) => {
        if (post.id !== id) return post;

        return {
          ...post,
          likeUsers: post.likeUsers.includes(currentUser.username)
            ? post.likeUsers.filter(
                (username) => username !== currentUser.username,
              )
            : [...post.likeUsers, currentUser.username],
        };
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
          className={`like-button cursor-pointer${activationLike ? " text-blue-500" : ""}`}
          onClick={onClickLike}
        >
          {/* FIXME: 숫자로 변환되면서 01이 되는데 이유 찾아보기 */}
          좋아요 {String(likeUsers.length)}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
