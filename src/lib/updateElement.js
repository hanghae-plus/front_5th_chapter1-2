// import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

// function updateAttributes(target, originNewProps, originOldProps) {}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  console.log("index: ", index);
  console.log("oldNode: ", oldNode);
  const newElement = createElement(newNode);
  parentElement.innerHTML = "";
  parentElement.appendChild(newElement);
}
