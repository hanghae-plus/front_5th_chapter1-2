import { addEvent } from "../lib";

export const applyProps = (element, props) => {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventKey = key.slice(2).toLowerCase();
      addEvent(element, eventKey, value);
      return;
    }

    if (key === "className") {
      element.setAttribute("class", value);
      return;
    }

    if (typeof value === "boolean") {
      if (value) {
        element.setAttribute(key, "");
      }
      return;
    }

    element.setAttribute(key, value);
  });
};

export const appendChild = (element, children, createElement) => {
  children.forEach((child) => {
    const node = createElement(child);
    element.appendChild(node);
  });
};
