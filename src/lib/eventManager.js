const handlers = new Map();
const eventTypes = new Set();

function setEventHandlers(e) {
  const target = e.target;

  const handlerEvent = handlers.get(target)?.get(e.type);
  handlerEvent?.(e);
}

export function setupEventListeners(root) {
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, setEventHandlers);
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
  console.log(handler);
  const elementHandlers = handlers.get(element);
  if (elementHandlers.has(eventType)) {
    elementHandlers.delete(eventType);
  }
}
