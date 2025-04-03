const eventStore = new Map();
const eventType = ["click", "input", "change", "keydown", "keyup"];

export function setupEventListeners(root) {
  eventType.forEach((eventType) =>
    root.addEventListener(eventType, dispatchEventHandler),
  );
}

function dispatchEventHandler(event) {
  let target = event.target;

  while (target && target !== event.currentTarget) {
    const handlers = eventStore.get(target);
    if (handlers?.[event.type]) {
      handlers[event.type](event);
      return;
    }
    target = target.parentElement;
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventStore.has(element)) {
    eventStore.set(element, {});
  }
  eventStore.get(element)[eventType] = handler;
}

export function removeEvent(element, eventType) {
  const handlers = eventStore.get(element);
  if (handlers) {
    delete handlers[eventType];
    if (Object.keys(handlers).length === 0) eventStore.delete(element);
  }
}
