/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores/globalStore.js";

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
  const { loggedIn, currentUser, posts } = globalStore.getState();
  const liked =
    loggedIn && likeUsers.find((user) => user === currentUser.username);

  const clickHandler = (e) => {
    e.preventDefault();
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }
    const thePost = posts.find((post) => post.id === id);
    let newLikeUsers = [];
    if (thePost.likeUsers.includes(currentUser.username)) {
      newLikeUsers = likeUsers.filter((user) => user !== currentUser.username);
    } else {
      newLikeUsers = [...likeUsers, currentUser.username];
    }
    const newPost = {
      ...thePost,
      likeUsers: newLikeUsers,
    };
    const newPosts = posts.map((post) => {
      if (post.id === id) {
        return newPost;
      }
      return post;
    });
    globalStore.setState({ posts: newPosts });
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
          className={`like-button cursor-pointer${liked ? " text-blue-500" : ""}`}
          onClick={clickHandler}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
