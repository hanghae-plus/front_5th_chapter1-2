const events = new Map();
let isListening = false;

export function setupEventListeners(root) {
  if (isListening) return;

  function getEventHandlers(e) {
    events.forEach((event) => {
      if (event.has(e.target)) event.get(e.target).forEach((fn) => fn(e));
    });
  }

  events.forEach((_, eventType) => {
    root.addEventListener(eventType, getEventHandlers);
  });

  isListening = true;
}

export function addEvent(element, eventType, handler) {
  if (!events.has(eventType)) events.set(eventType, new Map());
  const eventEl = events.get(eventType);

  const handlers = new Set();
  handlers.add(handler);

  if (!eventEl.has(element)) {
    eventEl.set(element, handlers);
  } else {
    eventEl.get(element).add(handler);
  }
}

export function removeEvent(element, eventType, handler) {
  const eventEls = events.get(eventType);

  if (!eventEls || !eventEls.has(element)) return;
  const handlers = events.get(eventType).get(element);
  handlers.delete(handler);
}
