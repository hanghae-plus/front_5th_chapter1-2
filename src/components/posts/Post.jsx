/** @jsx createVNode */
import { createVNode } from "../../lib";
import { toTimeFormat } from "../../utils/index.js";
import { globalStore } from "../../stores/globalStore.js";

function clickLike() {
  const { loggedIn } = globalStore.getState();

  if (!loggedIn) {
    alert("로그인 후 이용해주세요");
    return false;
  }
}

export const Post = ({
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
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
