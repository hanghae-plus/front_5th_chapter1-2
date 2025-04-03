const eventMap = {};
const rootListener = new Map();

export function setupEventListeners(root) {
  if (!rootListener.has(root)) rootListener.set(root, new Set());

  const registeredTypes = rootListener.get(root);

  Object.entries(eventMap).forEach(([eventType]) => {
    if (registeredTypes.has(eventType)) return;

    root.addEventListener(eventType, (e) => {
      const handlers = eventMap[eventType] || [];
      handlers.forEach(({ element, handler }) => {
        if (e.target === element) {
          handler(e);
        }
      });
    });
    registeredTypes.add(eventType);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventMap[eventType]) eventMap[eventType] = [];
  eventMap[eventType].push({ element, handler });
}

export function removeEvent(element, eventType, handler) {
  if (!eventMap[eventType]) return;

  eventMap[eventType] = (eventMap[eventType] || []).filter(
    (e) => e.element !== element || e.handler !== handler,
  );
  if (eventMap[eventType].length === 0) delete eventMap[eventType];
}
