import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

/*
  기존의 renderElement에서 코드를 수정해야 합니다.
    - 최초 렌더링일 때는 createElement 사용
    - 리렌더링일 때는 updateElement 사용
*/
const vNodeMap = new Map();

export function renderElement(vNode, container) {
  const newNode = normalizeVNode(vNode);

  if (container.innerHTML === "") {
    const element = createElement(newNode);
    container.appendChild(element);
    setupEventListeners(container);

    vNodeMap.set(container, newNode);
    return;
  }

  console.log("updating...");

  const oldNode = vNodeMap.get(container);
  vNodeMap.set(container, newNode);
  updateElement(container, newNode, oldNode);
}
