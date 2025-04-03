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
        if (key === "className") {
          $el.setAttribute("class", value);
        }
        // 이벤트 속성 처리
        else if (key.startsWith("on")) {
          addEvent($el, key.replace("on", "").toLowerCase(), value);
        }
        // 일반 속성 처리
        else {
          $el.setAttribute(key, value);
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
