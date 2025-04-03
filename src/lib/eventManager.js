const eventRegistry = new Map();
const eventType = ["click", "input", "change", "keydown", "keyup"];

export function setupEventListeners(root) {
  eventType.forEach((eventType) =>
    root.addEventListener(eventType, handleDelegatedEvent),
  );
}

function handleDelegatedEvent(event) {
  let target = event.target;

  while (target && target !== event.currentTarget) {
    const handlers = eventRegistry.get(target);
    if (handlers?.[event.type]) {
      handlers[event.type](event);
      return;
    }
    target = target.parentElement;
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventRegistry.has(element)) {
    eventRegistry.set(element, {});
  }
  eventRegistry.get(element)[eventType] = handler;
}

export function removeEvent(element, eventType) {
  const handlers = eventRegistry.get(element);
  if (handlers) {
    delete handlers[eventType];
    if (Object.keys(handlers).length === 0) eventRegistry.delete(element);
  }
}
