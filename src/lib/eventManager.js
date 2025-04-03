const events = new Map();
const handlerRefs = new Map();

export function setupEventListeners(root) {
  events.forEach((_, eventType) => {
    if (!handlerRefs.has(eventType)) {
      const handler = (e) => {
        const targets = events.get(eventType);
        if (!targets) return;

        let target = e.target;

        if (targets.has(target)) {
          const fns = targets.get(target);
          fns.forEach((fn) => fn(e));
        }
      };

      handlerRefs.set(eventType, handler);
    }

    const handler = handlerRefs.get(eventType);

    root.removeEventListener(eventType, handler);
    root.addEventListener(eventType, handler);
  });
}

export function addEvent(element, eventType, handler) {
  if (!events.has(eventType)) events.set(eventType, new Map());
  const eventEl = events.get(eventType);

  if (!eventEl.has(element)) {
    eventEl.set(element, new Set([handler]));
  } else {
    eventEl.get(element).add(handler);
  }
}

export function removeEvent(element, eventType, handler) {
  const eventEl = events.get(eventType);

  if (!eventEl || !eventEl.has(element)) return;
  const handlers = events.get(eventType).get(element);
  handlers.delete(handler);

  if (handlers.size === 0) eventEl.delete(element);

  if (eventEl.size === 0) events.delete(eventType);
}
