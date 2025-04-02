const eventListenersMap = new Map();

export function setupEventListeners(root) {
  for (const eventType of eventListenersMap.keys()) {
    root.removeEventListener(eventType, handleEvents);
    root.addEventListener(eventType, handleEvents);
  }
}

export function addEvent(element, eventType, handler) {
  if (!element || typeof handler !== "function") return;

  if (!eventListenersMap.has(eventType)) {
    eventListenersMap.set(eventType, new WeakMap());
  }

  eventListenersMap.get(eventType).set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  const handlers = eventListenersMap.get(eventType);

  if (handlers && handlers.get(element) === handler) {
    handlers.delete(element);
  }
}

export function handleEvents(e) {
  const handlers = eventListenersMap.get(e.type);

  if (handlers && handlers.has(e.target)) {
    handlers.get(e.target)(e);
  }
}
