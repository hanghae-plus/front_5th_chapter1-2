import { getTypes } from "../utils";

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
        if (/data-/.test(key)) {
          $el.dataset[key.replace("data-", "")] = value;
        } else {
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
