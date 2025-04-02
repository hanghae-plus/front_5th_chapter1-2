export function updateAttributes(target, originNewProps, originOldProps) {
  Object.entries(originNewProps ?? {}).forEach(([key, value]) => {
    const oldPropsValue = originOldProps?.[key];

    if (value !== oldPropsValue) {
      if (key.startsWith("on") && typeof value === "function") {
        const eventType = key.slice(2).toLowerCase();

        if (oldPropsValue && typeof oldPropsValue === "function") {
          target.removeEventListener(eventType, oldPropsValue);
        }

        target.addEventListener(eventType, value);
      } else if (key === "className") {
        target.setAttribute("class", value);
      } else {
        target.setAttribute(key, value);
      }
    }
  });

  if (originOldProps) {
    Object.keys(originOldProps).forEach((key) => {
      const oldPropsValue = originOldProps?.[key];

      if (!(originNewProps && key in originNewProps)) {
        if (key.startsWith("on") && typeof oldPropsValue === "function") {
          const eventType = key.slice(2).toLowerCase();
          target.removeEventListener(eventType, oldPropsValue);
        } else if (key === "className") {
          target.removeAttribute("class");
        } else {
          target.removeAttribute(key);
        }
      }
    });
  }
}
