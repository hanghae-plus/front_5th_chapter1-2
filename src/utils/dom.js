export const applyProps = (element, props) => {
  Object.entries(props).forEach(([key, value]) => {
    if (typeof value === "function") {
      element.addEventListener(key, value);
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
    if (child === undefined) {
      return;
    }
    const node = createElement(child);
    element.appendChild(node);
  });
};
