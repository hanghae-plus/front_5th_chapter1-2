const eventMap = new Map();

const eventTypeArr = [];

export function setupEventListeners($root) {
  eventTypeArr.forEach((eventType) => {
    $root.addEventListener(eventType, handleDelegatedEvent);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventTypeArr.includes(eventType)) {
    eventTypeArr.push(eventType);
  }

  const elementEvents = eventMap.get(element) || [];
  elementEvents.push({ eventType, handler });

  eventMap.set(element, elementEvents);
}
export function removeEvent(element, eventType, handler) {
  if (eventMap.has(element)) {
    const elementEvents = eventMap.get(element);
    const updatedElementEvents = elementEvents.filter(
      (h) => !(h.handler === handler && h.eventType === eventType),
    );
    eventMap.set(element, updatedElementEvents);
    if (updatedElementEvents.length === 0) {
      eventMap.delete(element);
    }
  }
}

function handleDelegatedEvent(e) {
  if (!eventMap.has(e.target)) return;

  const elementEvents = eventMap.get(e.target);
  const filtered = elementEvents.filter(
    ({ eventType }) => eventType === e.type,
  );

  filtered.forEach(({ handler }) => handler(e));
}
