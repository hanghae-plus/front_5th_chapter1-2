const eventTypeMap = new Map();

export function setupEventListeners(root) {
  for (const [eventType, typeEvents] of eventTypeMap) {
    root.addEventListener(eventType, (event) => {
      const target = event.target;
      if (typeEvents.has(target)) {
        const handler = typeEvents.get(target);
        handler(event);
      }
    });
  }
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
