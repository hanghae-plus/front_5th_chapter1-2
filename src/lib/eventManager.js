const eventListeners = new Map();
const eventTypes = new Set();

const eventHandler = (event) => {
  const target = event.target;
  const listeners = eventListeners.get(target);
  if (listeners) {
    listeners.forEach(({ eventType: type, handler }) => {
      if (type === event.type) {
        handler(event);
      }
    });
  }
};

export function setupEventListeners(root) {
  eventTypes.forEach((eventType) => {
    root.removeEventListener(eventType, eventHandler);
    root.addEventListener(eventType, eventHandler);
  });
}

export function addEvent(element, eventType, handler) {
  eventTypes.add(eventType);
  const events = eventListeners.get(element) || [];
  events.push({ eventType, handler });
  eventListeners.set(element, events);
}

export function removeEvent(element, eventType, handler) {
  if (eventListeners.has(element)) {
    const events = eventListeners.get(element);

    const index = events.findIndex(
      (event) => event.eventType === eventType && event.handler === handler,
    );
    if (index !== -1) {
      events.splice(index, 1);
      if (events.length === 0) {
        eventListeners.delete(element);
      }
    }
  }
}
