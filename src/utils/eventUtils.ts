const eventHandlers: Record<
  string,
  Record<string, (event: Event) => void>
> = {};

const handleGlobalEvents = (e: Event) => {
  const handlers = eventHandlers[e.type];
  if (!handlers) return;

  for (const selector in handlers) {
    if (e.target instanceof HTMLElement && e.target.matches(selector)) {
      handlers[selector](e);
      break;
    }
  }
};

export const registerGlobalEvents = (() => {
  let init = false;
  return () => {
    if (init) {
      return;
    }

    Object.keys(eventHandlers).forEach((eventType) => {
      document.body.addEventListener(eventType, handleGlobalEvents);
    });

    init = true;
  };
})();

export const addEvent = (
  eventType: string,
  selector: string,
  handler: (event: Event) => void,
) => {
  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = {};
  }
  eventHandlers[eventType][selector] = handler;
};
