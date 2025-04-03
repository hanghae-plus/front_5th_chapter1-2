const eventHandlers = {};

const handleGlobalEvents = (e) => {
  const handlers = eventHandlers[e.type];
  if (!handlers) return;

  for (const selector in handlers) {
    if (e.target.matches(selector)) {
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

export const addEvent = (eventType, selector, handler) => {
  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = {};
  }
  eventHandlers[eventType][selector] = handler;
};

/**
 * 'on'으로 시작하는 이벤트 prop 키를 정규화합니다.
 * @param {string} eventPropKey - 정규화할 이벤트 prop 키 (예: 'onClick', 'onSubmit')
 * @returns {string} 정규화된 이벤트 타입 (예: 'click', 'submit')
 */
export const normalizeEventPropKey = (eventPropKey) => {
  return eventPropKey.replace("on", "").toLowerCase();
};

/**
 * 엘리먼트의 프로토타입에 정의된 이벤트인지 확인합니다.
 * @param {HTMLElement} $el - 검사할 DOM 엘리먼트
 * @param {string} eventType - 검사할 정규화된 이벤트 타입 (예: 'click', 'submit')
 * @returns {boolean} 프로토타입에 정의된 이벤트면 true
 */
export const isPrototypeEvent = ($el, eventType) => {
  return `on${eventType}` in $el.constructor.prototype;
};
