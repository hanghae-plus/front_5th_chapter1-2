/** @jsx createVNode */
import { createVNode } from "../../lib";

export const Footer = () => (
  <footer className="bg-gray-200 p-4 text-center">
    <p>&copy; ${new Date().getFullYear()} 항해플러스. All rights reserved.</p>
  </footer>
);

// export const Footer = () => {
//   return createVNode(
//     "footer",
//     { className: "bg-gray-200 p-4 text-center" },
//     createVNode(
//       "p",
//       {
//         innerHTML: `&copy; ${new Date().getFullYear()} 항해플러스. All rights reserved.`,
//       },
//       null,
//     ),
//   );
// };

// 멘토링 : null이 꼭 필요한지..

// export const Footer = () => {
//   return createVNode(
//     "footer",
//     { className: "bg-gray-200 p-4 text-center" },
//     createVNode("p", null, `&copy; ${new Date().getFullYear()} 항해플러스. All rights reserved.`)
//   );
// };
