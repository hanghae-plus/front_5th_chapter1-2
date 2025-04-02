import { ElementWithHandlers, HTMLEventType } from "@/types";
import { EVENT_TYPES } from "../constants/eventType";

export function setupEventListeners(root: ElementWithHandlers) {
  if (!root) return;
  EVENT_TYPES.forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      let element: ElementWithHandlers = event.target as ElementWithHandlers;

      while (element && element !== root) {
        const handlers = element.handlers && element.handlers[eventType];
        if (handlers) {
          handlers.forEach((handler: any) => {
            handler(event);
          });
        }
        element = element.parentNode as ElementWithHandlers;
      }
    });
  });
}

export function addEvent(
  element: ElementWithHandlers,
  eventType: HTMLEventType,
  handler: (event: Event) => void,
) {
  if (!element || !eventType || typeof handler !== "function") return;

  if (!element.handlers) {
    element.handlers = {};
  }

  if (!element.handlers[eventType]) {
    element.handlers[eventType] = [];
  }

  element.handlers[eventType].push(handler);
}

export function removeEvent(
  element: ElementWithHandlers,
  eventType: HTMLEventType,
  handler: (event: Event) => void,
) {
  if (!element || !eventType || typeof handler !== "function") return;

  if (!element.handlers) return;

  if (!element.handlers[eventType]) return;

  element.handlers[eventType] = element.handlers[eventType].filter(
    (h) => h !== handler,
  );
}
