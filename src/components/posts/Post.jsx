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
  const { loggedIn, posts, currentUser } = globalStore.getState();

  function handleClickLikeBtn() {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const updatedPosts = posts.map((post) => {
      const isClickedLike = post.likeUsers.includes(currentUser.username);
      if (post.id === id) {
        if (isClickedLike) {
          // 좋아요 취소
          return {
            ...post,
            likeUsers: post.likeUsers.filter(
              (username) => username !== currentUser.username,
            ),
          };
        } else {
          return {
            ...post,
            likeUsers: [...post.likeUsers, currentUser.username], // 좋아요 추가
          };
        }
      }
      return post;
    });

    globalStore.setState({
      posts: updatedPosts,
    });
  }

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
          onClick={handleClickLikeBtn}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
