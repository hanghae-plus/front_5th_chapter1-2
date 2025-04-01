// { element, eventType, handler: { name, listener } }[]
const events = [];
let eventTarget = null;

export function setupEventListeners(root) {
  eventTarget = root;

  events.forEach(({ eventType, handler }) => {
    eventTarget.addEventListener(eventType, handler.listener);
  });
}

export function addEvent(element, eventType, handler) {
  const isDuplication = findIndex(element, eventType, handler) > -1;

  if (isDuplication) return;

  const listener = (e) => {
    if (!element.contains(e.target)) return;
    handler(e);
  };

  events.push({
    element,
    eventType,
    handler: {
      name: handler.name,
      listener,
    },
  });
}

export function removeEvent(element, eventType, handler) {
  const eventIndex = findIndex(element, eventType, handler);

  if (eventIndex < 0) return;

  eventTarget.removeEventListener(
    eventType,
    events[eventIndex].handler.listener,
  );
  events.splice(eventIndex, 1);
}

function findIndex(element, eventType, handler) {
  return events.findIndex((event) => {
    return (
      event.eventType === eventType &&
      event.element === element &&
      event.handler.name === handler.name
    );
  });
}
