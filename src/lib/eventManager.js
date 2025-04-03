const eventManagerMap = new Map();

export function setupEventListeners(root) {
  for (const eventType of eventManagerMap.keys()) {
    root.removeEventListener(eventType, handleEvents);
    root.addEventListener(eventType, handleEvents);
  }
}

export function addEvent(element, eventType, handler) {
  if (!element || typeof handler !== "function") return;

  if (!eventManagerMap.has(eventType)) {
    eventManagerMap.set(eventType, new Map());
    console.log(eventManagerMap);
  }

  eventManagerMap.get(eventType).set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  const handlers = eventManagerMap.get(eventType);

  if (handlers && handlers.get(element) === handler) {
    handlers.delete(element);
  }
}

function handleEvents(e) {
  const handlers = eventManagerMap.get(e.type);

  if (handlers && handlers.has(e.target)) {
    handlers.get(e.target)(e);
  }
}
