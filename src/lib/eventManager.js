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

  set(key, listener) {
    this.listeners[key] = { ...this.listeners[key], listener };
    console.log(this.listeners[key]);
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
    if ((this.listeners[key].root = root)) {
      // this.listeners[key] = {};
    }
  }
}

const eventListeners = new EventListenerStore();
export function removeEventListeners(root) {
  const allEvents = eventListeners.getAllDelegatedEvents(root);

  allEvents?.forEach((event) => {
    const [eventType, { listener }] = event;
    root.removeEventListener(eventType, listener);
    eventListeners.deleteEvent(eventType, root);
  });

  console.log("root에 딸린 이벤트", eventListeners.getAllDelegatedEvents(root));
}
export function setupEventListeners(root) {
  const allEvents = eventListeners.getAllEvents();

  allEvents.forEach(([eventType, { root: delegatedRoot, listener }]) => {
    if (delegatedRoot === root) {
      return;
    }

    const parsedEventType = eventType.split("_")[1];
    root.addEventListener(parsedEventType, listener);
    eventListeners.updateDelegatedRoot(eventType, root);
  });
}

export function addEvent(element, eventType, handler) {
  function listener(event) {
    if (event.target.tagName === element.tagName) {
      handler();
    }
  }

  eventListeners.set(`${element.tagName}_${eventType}`, listener);
}

export function removeEvent(element, eventType) {
  const event = eventListeners.get(`${element.tagName}_${eventType}`);
  if (event) {
    const { listener, root } = event;
    root.removeEventListener(eventType, listener);
  }
}
