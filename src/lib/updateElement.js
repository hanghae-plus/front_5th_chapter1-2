import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  Object.keys(newProps).forEach((key) => {
    const newProp = newProps[key];
    const oldProp = oldProps[key];
    if (newProp !== oldProp) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();

        if (oldProp) {
          removeEvent(target, eventType, oldProp);
        }

        if (newProp) {
          addEvent(target, eventType, newProp);
        }
      } else if (key === "className") {
        target.className = newProp;
      } else {
        target.setAttribute(key, newProp);
      }
    }
  });

  Object.keys(oldProps).forEach((key) => {
    const oldProp = oldProps[key];
    if (!newProps[key]) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, oldProp);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const { type: newType, props: newProps, children: newChildren } = newNode;
  const { type: oldType, props: oldProps, children: oldChildren } = oldNode;
  if (newType !== oldType) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }
  if (typeof newType === "string") {
    if (newType !== oldType) {
      parentElement.replaceChild(
        document.createTextNode(newNode),
        parentElement.childNodes[index],
      );
      return;
    }
  }

  if (newType === oldType) {
    updateAttributes(parentElement.childNodes[index], newProps, oldProps);
  }

  console.log("??dkdkdkk", newChildren, oldChildren);

  const childLength = Math.max(
    (newChildren || []).length,
    (oldChildren || []).length,
  );

  for (let i = 0; i < childLength; i++) {
    updateElement(
      parentElement.children[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
