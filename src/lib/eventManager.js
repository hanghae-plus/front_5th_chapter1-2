class EventListenerStore {
  constructor() {
    if (EventListenerStore.instance) {
      return EventListenerStore.instance;
    }
    this.listeners = new Map();
    EventListenerStore.instance = this;
  }

  get(key) {
    return this.listeners.get(key);
  }

  set(key, listener, root) {
    this.listeners.set(key, { listener, root });
  }

  updateDelegatedRoot(key, root) {
    const event = this.listeners.get(key);
    if (event) {
      event.root = root;
    }
  }

  getAllEvents() {
    return Array.from(this.listeners.entries());
  }

  getAllDelegatedEvents(delegatedRoot) {
    return Array.from(this.listeners.entries()).filter(([, event]) => {
      return event.root === delegatedRoot;
    });
  }

  deleteEvent(key, root) {
    const event = this.listeners.get(key);
    if (event?.root === root) {
      this.listeners.delete(key);
    }
  }
}

const eventListeners = new EventListenerStore();

export function removeEventListeners(root) {
  const allEvents = eventListeners.getAllDelegatedEvents(root);

  allEvents?.forEach(([key, { listener }]) => {
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
      // event.preventDefault();
      handler(event);
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
