const events = [];

export function setupEventListeners(root) {
  for (let i = 0; i < events.length; i++) {
    if (root.contains(events[i].element)) {
      events[i].root = root;
    }
  }

  const eventTypes = [];
  for (let i = 0; i < events.length; i++) {
    if (events[i].root === root) {
      if (eventTypes.indexOf(events[i].eventType) === -1) {
        eventTypes.push(events[i].eventType);
      }
    }
  }

  if (root.__eventListeners) {
    for (const type in root.__eventListeners) {
      root.removeEventListener(type, root.__eventListeners[type]);
    }
  }

  root.__eventListeners = {};

  for (let i = 0; i < eventTypes.length; i++) {
    const type = eventTypes[i];
    const handler = function (event) {
      for (
        let target = event.target;
        target && target !== root;
        target = target.parentNode
      ) {
        for (let j = 0; j < events.length; j++) {
          if (
            events[j].element === target &&
            events[j].eventType === type &&
            events[j].root === root
          ) {
            events[j].handler(event);
          }
        }
      }
    };

    root.addEventListener(type, handler);
    root.__eventListeners[type] = handler;
  }
}

export function addEvent(element, eventType, handler) {
  events.push({
    element: element,
    eventType: eventType,
    handler: handler,
    root: null,
  });

  return { element, eventType, handler };
}

export function removeEvent(element, eventType, handler) {
  for (let i = 0; i < events.length; i++) {
    if (
      events[i].element === element &&
      events[i].eventType === eventType &&
      events[i].handler === handler
    ) {
      events.splice(i, 1);
      i--;
    }
  }
}