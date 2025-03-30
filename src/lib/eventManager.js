const eventsMap = {};

export function setupEventListeners(root) {
  Object.entries(eventsMap).forEach(([eventType, elements]) => {
    if (eventType.startsWith("on"))
      eventType = eventType.slice(2).toLowerCase();
    root.addEventListener(eventType, (e) => {
      const target = e.target;
      elements.forEach((handlers, el) => {
        if (el.contains(target)) {
          handlers.forEach((fn) => fn.call(el, e));
        }
      });
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventsMap[eventType]) eventsMap[eventType] = new Map();
  const elements = eventsMap[eventType];
  if (!elements.has(element)) elements.set(element, new Set());
  elements.get(element).add(handler);
}

export function removeEvent(element, eventType, handler) {
  const elements = eventsMap[eventType];
  if (!elements) return;
  const handlers = elements.get(element);
  if (!handlers) return;
  handlers.delete(handler);
  if (handlers.size === 0) elements.delete(element);
  if (elements.size === 0) delete eventsMap[eventType];
}
