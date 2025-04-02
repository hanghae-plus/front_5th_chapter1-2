import { createElement } from "./createElement.js";
import { addEvent, removeEvent } from "./eventManager.js";

/**newNode와 oldNode의 attribute를 비교하여 변경된 부분만 반영.*/
function updateAttributes(target, newProps, oldProps) {
  //달라지거나 추가된 props를 반영
  for (let [attr, value] of Object.entries(newProps)) {
    if (newProps[attr] === oldProps[attr]) continue;
    if (attr === "className") attr = "class";
    if (attr.startsWith("on")) {
      return addEvent(target, attr.replace("on", "").toLowerCase(), value);
    }
    target.setAttribute(attr, value);
  }
  for (const attr of Object.keys(oldProps)) {
    if (newProps[attr] !== undefined) continue;
    if (attr.startsWith("on")) {
      removeEvent(target, attr.replace("on", "").toLowerCase(), oldProps[attr]);
    }
    target.removeAttribute(attr);
  }
}

/**기존 container가 비어있지 않다면 실행할 Element업데이트 함수.
 * @param {HTMLElement} containerElement
 */
export function updateElement(containerElement, newNode, oldNode, index = 0) {
  const currnetChildNodes = containerElement.childNodes[index];

  if (oldNode && !newNode) {
    return containerElement.removeChild(currnetChildNodes);
  }

  if (!oldNode && newNode) {
    return containerElement.appendChild(createElement(newNode));
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return; //같은문자

    return containerElement.replaceChild(
      createElement(newNode),
      currnetChildNodes,
    );
  }

  if (oldNode.type !== newNode.type) {
    return containerElement.replaceChild(
      createElement(newNode),
      currnetChildNodes,
    );
  }

  updateAttributes(currnetChildNodes, newNode.props || {}, oldNode.props || {});

  let newNodeLength = newNode.children.length;
  let oldNodeLength = oldNode.children.length;

  const depth = newNodeLength >= oldNodeLength ? newNodeLength : oldNodeLength;
  for (let i = 0; i < depth; i++) {
    updateElement(
      currnetChildNodes,
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
