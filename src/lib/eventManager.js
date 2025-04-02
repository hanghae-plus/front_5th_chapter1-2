class EventListenerStore {
  constructor() {
    if (EventListenerStore.instance) {
      return EventListenerStore.instance;
    }
    this.listeners = {};
    EventListenerStore.instance = this;
  }

  get(key) {
    return this.listeners[key];
  }

  set(key, listener, root) {
    this.listeners[key] = { listener, root };
  }

  updateDelegatedRoot(key, root) {
    this.listeners[key] = {
      ...this.listeners[key],
      root,
    };
  }

  getAllEvents() {
    return Object.entries(this.listeners);
  }

  getAllDelegatedEvents(delegatedRoot) {
    return Object.entries(this.listeners).filter((event) => {
      const { root } = event[1];
      return root === delegatedRoot;
    });
  }

  deleteEvent(key, root) {
    if (this.listeners[key]?.root === root) {
      delete this.listeners[key];
    }
  }
}

const eventListeners = new EventListenerStore();

export function removeEventListeners(root) {
  const allEvents = eventListeners.getAllDelegatedEvents(root);

  allEvents?.forEach((event) => {
    const [key, { listener }] = event;
    const eventType = key.split("_")[1];
    root.removeEventListener(eventType, listener);
    eventListeners.deleteEvent(key, root);
  });
}

export function setupEventListeners(root) {
  const allEvents = eventListeners.getAllEvents();

  allEvents.forEach(([key, { root: delegatedRoot, listener }]) => {
    if (delegatedRoot === root) {
      return;
    }

    const eventType = key.split("_")[1];
    root.addEventListener(eventType, listener);
    eventListeners.updateDelegatedRoot(key, root);
  });
}

export function addEvent(element, eventType, handler) {
  function listener(event) {
    if (event.target === element || event.target.tagName === element.tagName) {
      handler();
    }
  }

  const key = `${element.tagName}_${eventType}`;
  const existingEvent = eventListeners.get(key);

  if (existingEvent) {
    const { root } = existingEvent;
    if (root) {
      const existingEventType = key.split("_")[1];
      root.removeEventListener(existingEventType, existingEvent.listener);
    }
  }

  eventListeners.set(key, listener, null);
}

export function removeEvent(element, eventType) {
  const key = `${element.tagName}_${eventType}`;
  const event = eventListeners.get(key);
  if (event) {
    const { listener, root } = event;
    if (root) {
      root.removeEventListener(eventType, listener);
    }
    eventListeners.deleteEvent(key, root);
  }
}
