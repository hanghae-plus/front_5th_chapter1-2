const delegatedEvents = new Map();
const delegatedRoots = new WeakMap();

export function setupEventListeners(delegateRoot) {
  if (!delegatedRoots.has(delegateRoot)) {
    delegatedRoots.set(delegateRoot, new Set());
  }

  const boundEvents = delegatedRoots.get(delegateRoot);

  delegatedEvents.forEach((delegates, eventType) => {
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

export function addEvent(delegateTarget, eventType, delegateHandler) {
  if (!delegatedEvents.has(eventType)) {
    delegatedEvents.set(eventType, new Map());
  }

  const delegates = delegatedEvents.get(eventType);
  delegates.set(delegateTarget, delegateHandler);
}

export function removeEvent(delegateTarget, eventType) {
  const delegates = delegatedEvents.get(eventType);
  if (delegates) {
    delegates.delete(delegateTarget);
  }
}
