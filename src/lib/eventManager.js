const eventMap = new Map();
const rootEventMap = new Map();

export function setupEventListeners(root) {
  if (!rootEventMap.has(root)) {
    rootEventMap.set(root, new Set());
  }

  const rootEvents = rootEventMap.get(root);

  eventMap.forEach((typeEvents, eventType) => {
    if (rootEvents.has(eventType)) return;

    rootEvents.add(eventType);

    root.addEventListener(eventType, (event) => {
      const target = event.target;

      if (typeEvents.has(target)) {
        const handler = typeEvents.get(target);
        handler(event);
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Map());
  }
  const targetEvent = eventMap.get(eventType);
  targetEvent.set(element, handler);
}

export function removeEvent(element, eventType) {
  if (eventMap.has(eventType)) {
    const targetEvent = eventMap.get(eventType);
    if (targetEvent.has(element)) {
      targetEvent.delete(element);
    }
  }
}
