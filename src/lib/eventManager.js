const eventMap = new Map();

export function setupEventListeners(root) {
  eventMap.forEach((_, eventType) => {
    root.removeEventListener(eventType, handleEvent);
    root.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(event) {
  const handlers = eventMap.get(event.type);
  if (!handlers) return;

  const handler = handlers.get(event.target);
  if (typeof handler === "function") {
    handler(event);
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new WeakMap());
  }

  eventMap.get(eventType).set(element, handler);
}

export function removeEvent(element, eventType) {
  if (!eventMap.has(eventType)) return;

  eventMap.get(eventType).delete(element);
}
