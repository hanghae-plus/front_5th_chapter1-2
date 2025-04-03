import { updateAttributes } from "../utils";
import { createElement } from "./createElement.js";

export function updateElement($parentElement, newNode, oldNode, index = 0) {
  const $origin = $parentElement.childNodes[index];
  // 업데이트 함수로 생성 / 삭제, children for문으로 처리
  if (newNode && !oldNode) {
    $parentElement.appendChild(createElement(newNode));
    return;
  } else if (!newNode && oldNode) {
    if ($origin) $parentElement.removeChild($origin);
    return;
  }

  // update 텍스트 노드
  if (typeof newNode === "string") {
    if (newNode !== oldNode) $origin.textContent = newNode;
    return;
  }

  if (typeof newNode.type === "function") throw new Error("노멀라이즈 필요");
  if (typeof newNode.type !== "string") throw new Error();

  // 교체
  if (newNode.type !== oldNode.type) {
    $parentElement.replaceChild(createElement(newNode), $origin);
    return;
  }

  // props, createElement와 다르게, 기존
  updateAttributes($origin, newNode.props || {}, oldNode.props || {});

  // children 줄어들거나, 늘어나거나 고려.
  const length = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < length; i++) {
    const nn = newNode.children?.[i];
    const on = oldNode.children?.[i];
    updateElement($origin, nn, on, i);
  }
}
