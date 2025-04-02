export function setupEventListeners(root) {
  const els = document.querySelectorAll("*");
  els.forEach((el) =>
    root.addEventListener(el["custom-event"], (e) => {
      if (e.target === el) {
        el["custom-handler"]();
      }
    }),
  );
}

export function addEvent(element, eventType, handler) {
  element["custom-event"] = eventType;
  element["custom-handler"] = handler;
}

export function removeEvent(element, eventType, handler) {
  if (element["custom-event"] === eventType) element["custom-event"] = null;
  if (element["custom-handler"] === handler) element["custom-handler"] = null;
}
