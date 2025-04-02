/** @jsx createVNode */
import { createVNode } from "../../lib/vdom/index";
import { toTimeFormat } from "../../utils/index";
import { userStore, postStore } from "../../stores";

interface PostProps {
  id: number;
  author: string;
  time: number;
  content: string;
  likeUsers: string[];
}

export const Post = ({ id, author, time, content, likeUsers }: PostProps) => {
  const { loggedIn, currentUser } = userStore.getState();
  const { posts } = postStore.getState();

  const handleLike = () => {
    if (!loggedIn || !currentUser) {
      alert("로그인 후 이용해주세요");
      return null;
    }

    const newPosts = posts.map((post) => {
      if (post.id === id) {
        if (post.likeUsers.includes(currentUser.username)) {
          return {
            ...post,
            likeUsers: post.likeUsers.filter(
              (user) => user !== currentUser.username,
            ),
          };
        }
        return {
          ...post,
          likeUsers: [...post.likeUsers, currentUser.username],
        };
      }
      return post;
    });

    postStore.setState({
      posts: newPosts,
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
          className={`like-button cursor-pointer${
            currentUser && likeUsers.includes(currentUser.username)
              ? " text-blue-500"
              : ""
          }`}
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
