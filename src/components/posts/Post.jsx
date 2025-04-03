/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores";

export const Post = ({ id, author, time, content, likeUsers }) => {
  const { loggedIn, currentUser } = globalStore.getState();
  const { posts } = globalStore.getState();
  // 현재 사용자 정보 가져오기

  // 현재 사용자가 이 게시물에 좋아요를 눌렀는지 계산
  const activationLike = currentUser
    ? likeUsers.includes(currentUser.id)
    : false;

  const handleLikeClick = (e) => {
    if (!loggedIn) {
      window.alert("로그인 후 이용해주세요");
      return;
    }
    const updateProfile = posts.map((post) => {
      if (post.id !== id) return post;

      // 현재 게시물의 likeUsers 복사
      const updatedLikeUsers = [...post.likeUsers];

      if (activationLike) {
        // 좋아요 취소
        const index = updatedLikeUsers.indexOf(currentUser.id);
        if (index !== -1) updatedLikeUsers.splice(index, 1);
      } else {
        // 좋아요 추가
        updatedLikeUsers.push(currentUser.id);
      }
      return {
        ...post,
        likeUsers: updatedLikeUsers,
      };
    });
    // globalStore 업데이트
    globalStore.setState({ posts: updateProfile });

    // id값을 받아와서 posts에서 찾고 likeusers값을 푸쉬 해주면 되고, 색상도 바꿔주면 된다~ 어떤걸로 ? activationLike로
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
          onclick={handleLikeClick}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
