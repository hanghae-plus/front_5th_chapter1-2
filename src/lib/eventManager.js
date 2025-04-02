const handlers = new Map();
// handlers = {
//   element: {
//      click: (e) => {...}
//   }
// }
const eventTypes = new Set();
// eventTypes = ['click', 'mousedown', ...]

const handleEvents = (e) => {
  const handler = handlers.get(e.target)?.get(e.type);
  handler?.(e);
};

export function setupEventListeners(root) {
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, handleEvents);
  });
}

export function addEvent(element, eventType, handler) {
  eventTypes.add(eventType);

  if (!handlers.has(element)) {
    handlers.set(element, new Map());
  }
  const elementHandlers = handlers.get(element);
  elementHandlers.set(eventType, handler);
}

export function removeEvent(element, eventType, handler) {
  const elementHandlers = handlers.get(element);
  if (elementHandlers?.has(eventType)) {
    elementHandlers.delete(eventType);
  }
  if (typeof handler !== "function") {
    console.log("wow");
  }
}
