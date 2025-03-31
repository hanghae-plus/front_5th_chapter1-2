export function setupEventListeners(root) {
  if (!root) return;

  const eventTypes = [
    "click",
    "input",
    "change",
    "submit",
    "keydown",
    "keyup",
    "keypress",
    "mouseover",
    "focus",
  ];

  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      let element = event.target;

      if (event.isPropagationStopped) {
        return;
      }

      while (element && element !== root) {
        const handlers = element._handlers && element._handlers[eventType];
        if (handlers) {
          handlers.forEach((handler) => {
            handler(event);
          });
        }
        element = element.parentNode;
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!element || !eventType || typeof handler !== "function") return;

  if (!element._handlers) {
    element._handlers = {};
  }

  if (!element._handlers[eventType]) {
    element._handlers[eventType] = [];
  }

  element._handlers[eventType].push(handler);
}

export function removeEvent(element, eventType, handler) {
  if (!element || !eventType || typeof handler !== "function") return;

  if (!element._handlers) return;

  if (!element._handlers[eventType]) return;

  element._handlers[eventType] = element._handlers[eventType].filter(
    (h) => h !== handler,
  );
}
