let _root = null;

/**
 * @type {Set<Element>}
 */
const elementSet = new Set();

/**
 * element => eventType => handler => wrappedHandler 이순으로 구성
 * @type {WeakMap<Element, Map<string, Map<Function, Function>>>}
 */
const eventListenerMap = new WeakMap();

/**
 *
 * @param {Element} root
 */
export function setupEventListeners(root) {
  if (!root)
    throw new Error("setupEventListeners: root가 정의되지 않았습니다.");
  _root = root;

  for (const element of elementSet) {
    const eventTypeMap = eventListenerMap.get(element);
    if (!eventTypeMap) continue;

    for (const [eventType, handlerMap] of eventTypeMap.entries()) {
      for (const wrappedHandler of handlerMap.values()) {
        _root.addEventListener(eventType, wrappedHandler);
      }
    }
  }
}

/**
 *
 * @param {Element} element
 * @param {string} eventType
 * @param {(event: Event) => void} handler
 */
export function addEvent(element, eventType, handler) {
  elementSet.add(element);

  if (!eventListenerMap.has(element)) {
    eventListenerMap.set(element, new Map());
  }

  const eventTypeMap = eventListenerMap.get(element);

  if (!eventTypeMap.has(eventType)) {
    eventTypeMap.set(eventType, new Map());
  }

  const handlerMap = eventTypeMap.get(eventType);

  if (!handlerMap.has(handler)) {
    // element가 event.target을 포함하고 있는 경우에만 핸들러를 등록
    const wrappedHandler = (event) => {
      if (element.contains(event.target)) {
        handler(event);
      }
    };
    handlerMap.set(handler, wrappedHandler);
  }
}

/**
 * 핸들러 제거. 실제로 _root에 등록된 함수도 제거함.
 *
 * @param {Element} element
 * @param {string} eventType
 * @param {(event: Event) => void} handler
 */
export function removeEvent(element, eventType, handler) {
  const eventTypeMap = eventListenerMap.get(element);
  if (!eventTypeMap) return;

  const handlerMap = eventTypeMap.get(eventType);
  if (!handlerMap) return;

  const wrappedHandler = handlerMap.get(handler);
  if (wrappedHandler) {
    _root.removeEventListener(eventType, wrappedHandler);
  }

  handlerMap.delete(handler);

  if (handlerMap.size === 0) {
    eventTypeMap.delete(eventType);
  }

  if (eventTypeMap.size === 0) {
    eventListenerMap.delete(element);
    elementSet.delete(element);
  }
}
