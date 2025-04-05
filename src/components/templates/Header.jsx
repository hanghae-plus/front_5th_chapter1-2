/** @jsx createVNode */
import { createVNode } from "../../lib";

export const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 sticky top-0">
      <h1 className="text-2xl font-bold">항해플러스</h1>
    </header>
  );
};

// const root = document.getElementById('root');
// root.appendChild(Header);

// createVNode 보통 h함수로 작성한다.
// 자식요소가 하나일 경우, [] 생략해도 된다.

// export const Header = () => {
//   return createVNode(
//     "header",
//     { className: "bg-blue-600 text-white p-4 sticky top-0" },
//     createVNode("h1", { className: "text-2xl font-bold" }, "항해플러스"),
//   );
// };

// export const Header = () => {
//   return createVNode(
//     "header",
//     { className: "bg-blue-600 text-white p-4 sticky top-0" },
//     createVNode("h1", { className: "text-2xl font-bold" }, "항해플러스")
//   );
// };
