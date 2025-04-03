const eventStore = new Map();

export function setupEventListeners(root) {
  if (!root) return;

  Object.keys(eventStore).forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(event) {
  const { type, target } = event;

  if (!eventStore[type]) return;

  for (const [element, handler] of eventStore[type].entries()) {
    if (element === target || element.contains(target)) {
      handler(event);
      break;
    }
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventStore[eventType]) {
    eventStore[eventType] = new Map();
  }
  eventStore[eventType].set(element, handler);
}

export function removeEvent(element, eventType) {
  if (!eventStore[eventType]) return;

  eventStore[eventType].delete(element);
}
