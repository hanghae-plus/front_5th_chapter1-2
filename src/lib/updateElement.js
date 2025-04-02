import { createElement } from "./createElement";
import { updateAttributes } from "./updateAttributes";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes?.[index]);
    return;
  }

  if (newNode && !oldNode) {
    const createEl = createElement(newNode);
    if (parentElement) {
      parentElement.appendChild(createEl);
    }
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (oldNode !== newNode) {
      const textNode = document.createTextNode(newNode);
      if (parentElement?.childNodes?.[index]) {
        parentElement.replaceChild(textNode, parentElement.childNodes?.[index]);
      }
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes?.[index],
    );
    return;
  }

  //oldNode와 newNode의 type이 같을 경우
  updateAttributes(
    parentElement.childNodes?.[index],
    newNode.props,
    oldNode?.props,
  );

  const newNodeChildren = Array.from(newNode.children);
  const oldNodeChildren = Array.from(oldNode.children);

  const max = Math.max(newNodeChildren.length, oldNodeChildren.length);

  for (let i = 0; i < max; i++) {
    updateElement(
      parentElement.childNodes?.[index],
      newNodeChildren[i],
      oldNodeChildren[i],
      i,
    );
  }
}
