const eventsMap = new Map();

export function setupEventListeners(root) {
  eventsMap.set("root", root);
  eventsMap.forEach(({ eventType, handler }) => {
    root.addEventListener(eventType, handler);
  });
}

export function addEvent(element, eventType, handler) {
  eventsMap.set(element, { eventType, handler });
}

export function removeEvent(element, eventType, handler) {
  (eventsMap.get("root") || element).removeEventListener(eventType, handler);
}
