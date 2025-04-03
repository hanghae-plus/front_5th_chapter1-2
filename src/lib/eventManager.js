const eventHandler = new Map();

export function setupEventListeners(root) {
  if (!root) {
    return;
  }

  Object.keys(eventHandler).forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}
function handleEvent(event) {
  const { type, target } = event;

  if (!eventHandler[type]) return;

  for (const [element, handler] of eventHandler[type].entries()) {
    if (element === target || element.contains(target)) {
      handler(event);
      break;
    }
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventHandler[eventType]) {
    eventHandler[eventType] = new Map();
  }
  eventHandler[eventType].set(element, handler);
}

export function removeEvent(element, eventType) {
  if (eventHandler[eventType]) {
    eventHandler[eventType].delete(element);
  }
}
