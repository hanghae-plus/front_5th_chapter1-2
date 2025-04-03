/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils";
import { globalStore } from "../../stores";

// set을 이용해 좋아요 업데이트.
// activationLike === true 이면 false로 바뀌면서 likeUsers에서 제거.
// 반대의경우 false에서 true로 바뀌면서 likeUsers에 추가
// 0403 마지막 div만 이벤트 변경이 일어나는 현상 발생
// 어떤 div가 바뀌어야하는지 감지하지 못해서인듯 즉 매칭을 똑바로 못시켰기 때문인듯....
// sdfkljsdklfjasdklfjaskldfjaskldf

export const Post = ({
  key,
  id,
  author,
  time,
  content,
  likeUsers,
  isLoggedIn,
  activationLike = false,
}) => {
  const toggleLike = () => {
    // content 와 author를 이용하여 해당 컨텐트를 작성한 사람의 post를 추가함.
    // 추가할때 user는 현재 로그인한 사람으로 함.
    if (!isLoggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }
    const { posts, currentUser } = globalStore.getState();
    const newPost = posts.map((post) => {
      if (post.id === id) {
        if (post.likeUsers.includes(currentUser)) {
          // 좋아요 취소
          const newLikeUsers = post.likeUsers.filter(
            (user) => user !== currentUser,
          );
          return { ...post, likeUsers: newLikeUsers };
        }
        return { ...post, likeUsers: [currentUser] };
      }
      return post;
    });
    globalStore.setState({ posts: newPost });
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
          id={`${author}_${id}`}
          onClick={toggleLike}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
