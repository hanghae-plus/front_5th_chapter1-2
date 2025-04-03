/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores/globalStore.js";
import { toTimeFormat } from "../../utils/index.js";
import { checkLoggedIn } from "../../utils/userUtils.js";

export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
  const { currentUser, loggedIn, posts } = globalStore.getState();

  const handleLike = () => {
    if (!checkLoggedIn(loggedIn)) return;

    const updatePost = posts.filter((post) => post.id === id)[0];
    const likeIndex = updatePost?.likeUsers.indexOf(currentUser.username);
    const hasLiked = likeIndex === -1;

    if (hasLiked) {
      updatePost.likeUsers.push(currentUser.username);
    }

    if (!hasLiked) {
      updatePost.likeUsers.splice(likeIndex, 1);
    }

    posts[id - 1] = updatePost;
    globalStore.setState({ posts });
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
          onClick={handleLike}
          className={`like-button cursor-pointer${activationLike ? " text-blue-500" : ""}`}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};
