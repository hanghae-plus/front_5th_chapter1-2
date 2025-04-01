const rootEventMap = new Map();
const eventTypeMap = new Map();

export function setupEventListeners(root) {
  if (!rootEventMap.has(root)) {
    rootEventMap.set(root, new Set());
  }

  const rootEvents = rootEventMap.get(root);

  eventTypeMap.forEach((typeEvents, eventType) => {
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
  if (!eventTypeMap.has(eventType)) {
    eventTypeMap.set(eventType, new Map());
  }
  const typeEvents = eventTypeMap.get(eventType);
  typeEvents.set(element, handler);
}

export function removeEvent(element, eventType) {
  if (eventTypeMap.has(eventType)) {
    const typeEvents = eventTypeMap.get(eventType);
    if (typeEvents.has(element)) {
      typeEvents.delete(element);
    }
  }
}
