import { getTypes } from "../utils";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  const vNodeType = getTypes(vNode);

  const invalidTypes = ["null", "undefined", "boolean"];
  if (invalidTypes.includes(vNodeType)) {
    return document.createTextNode("");
  }

  const textNodeTypes = ["string", "number"];
  if (textNodeTypes.includes(vNodeType)) {
    return document.createTextNode(vNode);
  }

  if (vNodeType === "object") {
    /** @type {HTMLElement} */
    const $el = document.createElement(vNode.type);

    if (vNode.props) {
      Object.entries(vNode.props).forEach(([key, value]) => {
        // data-set 속성 처리
        if (/data-/.test(key)) {
          $el.dataset[key.replace("data-", "")] = value;
        }
        // 이벤트 속성 처리
        else if (/on[A-Z]/.test(key)) {
          addEvent($el, key.replace("on", "").toLowerCase(), value);
        }
        // 일반 속성 처리
        else {
          $el[key] = value;
        }
      });
    }

    vNode.children
      .filter((child) => child !== undefined)
      .forEach((child) => $el.appendChild(createElement(child)));

    return $el;
  }

  if (vNodeType === "array") {
    const $el = document.createDocumentFragment();
    vNode.forEach((child) => $el.appendChild(createElement(child)));

    return $el;
  }
}
