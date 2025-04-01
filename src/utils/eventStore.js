/**
 * @type {WeakMap<Element, { [eventType: string]: Function }>}
 * 각 element가 등록한 이벤트 타입과 핸들러를 저장
 */
export const elementEventMap = new WeakMap();

/**
 * @type {WeakMap<Element, Set<string>>}
 * 루트 요소에 이미 바인딩된 이벤트 타입을 저장
 * 중복 이벤트 등록을 방지하기 위한 용도
 */
export const attachedEventMap = new WeakMap();

/**
 * @type {Set<Element>}
 * addEvent()를 통해 이벤트가 등록된 모든 엘리먼트를 추적
 */
export const trackedElements = new Set();

/**
 * @type {WeakMap<Element, Map<string, Map<Element, Function>>>}
 * 실제 루트에 등록된 이벤트 위임 핸들러들의 매핑을 저장
 */
export const delegationMap = new WeakMap();

/**
 * @type {WeakMap<Element, Element>}
 * removeEvent() 시 해당 엘리먼트가 속한 루트를 찾아 delegationMap 정리에 사용
 *
 */
export const elementToRootMap = new WeakMap();
