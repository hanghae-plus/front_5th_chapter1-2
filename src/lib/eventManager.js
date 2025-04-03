const eventMap = new Map();
const eventHandlerMap = new Map();

let rootElement = null;

export function setupEventListeners(root) {
  if (!root) return;
  rootElement = root;

  eventHandlerMap.forEach((handlers, eventType) => {
    rootElement.removeEventListener(eventType, handlers);
  });
  eventHandlerMap.clear();

  eventMap.forEach((handlers, eventType) => {
    const eventHandler = (e) => {
      for (const [element, handler] of handlers.entries()) {
        if (element === e.target) {
          handler(e);
          break;
        }
      }
    };

    rootElement.addEventListener(eventType, eventHandler);
    eventHandlerMap.set(eventType, eventHandler);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Map());
  }

  const handlers = eventMap.get(eventType);
  handlers.set(element, handler);
}

export function removeEvent(element, eventType) {
  const handlers = eventMap.get(eventType);
  if (handlers && handlers.get(element)) {
    handlers.delete(element);
  }
}
