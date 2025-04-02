class EventManager {
  #delegatedEvents = new Map();
  #delegatedRoots = new WeakMap();

  setupEventListeners(delegateRoot: HTMLElement) {
    if (!this.#delegatedRoots.has(delegateRoot)) {
      this.#delegatedRoots.set(delegateRoot, new Set());
    }

    const boundEvents = this.#delegatedRoots.get(delegateRoot);

    this.#delegatedEvents.forEach((delegates, eventType) => {
      if (boundEvents.has(eventType)) return;

      delegateRoot.addEventListener(eventType, (event) => {
        for (const [delegateTarget, delegateHandler] of delegates) {
          if (delegateTarget.contains(event.target)) {
            delegateHandler.call(delegateTarget, event);
          }
        }
      });

      boundEvents.add(eventType);
    });
  }

  addEvent(
    delegateTarget: HTMLElement,
    eventType: string,
    delegateHandler: (event: Event) => void,
  ) {
    if (!this.#delegatedEvents.has(eventType)) {
      this.#delegatedEvents.set(eventType, new Map());
    }

    const delegates = this.#delegatedEvents.get(eventType);
    delegates.set(delegateTarget, delegateHandler);
  }

  removeEvent(
    delegateTarget: HTMLElement,
    eventType: string,
    delegateHandler: (event: Event) => void,
  ) {
    const delegates = this.#delegatedEvents.get(eventType);
    if (!delegates) return;

    const existing = delegates.get(delegateTarget);
    if (existing === delegateHandler) {
      delegates.delete(delegateTarget);
    }
  }
}

export const eventManager = new EventManager();

export const setupEventListeners = (element: HTMLElement) =>
  eventManager.setupEventListeners(element);
export const addEvent = (
  element: HTMLElement,
  eventType: string,
  handler: (event: Event) => void,
) => eventManager.addEvent(element, eventType, handler);
export const removeEvent = (
  element: HTMLElement,
  eventType: string,
  handler: (event: Event) => void,
) => eventManager.removeEvent(element, eventType, handler);
