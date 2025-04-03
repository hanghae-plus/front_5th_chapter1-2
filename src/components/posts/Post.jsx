/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores/globalStore.js";

function likePost(author) {
  // const updateLike = posts.findIndex((post) => post.author === author);
  globalStore.setState({
    posts: globalStore.getState().posts.map((post) =>
      post.author === author
        ? {
            ...post,
            likeUsers: post.likeUsers.includes("좋아요")
              ? post.likeUsers.filter((user) => user !== "좋아요")
              : [...post.likeUsers, "좋아요"],
          }
        : post,
    ),
  });
}

export const Post = ({
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
  if (likeUsers.length != 0) {
    activationLike = true;
  }

  const { loggedIn } = globalStore.getState();

  const clickLike = (e) => {
    e.preventDefault();
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return false;
    }
    if (loggedIn) {
      // console.log('I am logged in!');
      // console.log(author);
      likePost(author);
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
          onClick={clickLike}
        >
          좋아요 {likeUsers.length}
        </span>
        <span>댓글</span>
        <span>공유</span>
      </div>
    </div>
  );
};

// export const Post = ({
//   author,
//   time,
//   content,
//   likeUsers,
//   activationLike = false,
// }) => {
//   return createVNode(
//     "div",
//     { className: "bg-white rounded-lg shadow p-4 mb-4" },
//     createVNode(
//       "div",
//       { className: "flex items-center mb-2" },
//       createVNode(
//         "div",
//         null,
//         createVNode("div", { className: "font-bold" }, author),
//         createVNode(
//           "div",
//           { className: "text-gray-500 text-sm" },
//           toTimeFormat(time)
//         )
//       )
//     ),
//     createVNode("p", null, content),
//     createVNode(
//       "div",
//       { className: "mt-2 flex justify-between text-gray-500" },
//       createVNode(
//         "span",
//         {
//           className: `like-button cursor-pointer${
//             activationLike ? " text-blue-500" : ""
//           }`,
//         },
//         `좋아요 ${likeUsers.length}`
//       ),
//       createVNode("span", null, "댓글"),
//       createVNode("span", null, "공유")
//     )
//   );
// };
