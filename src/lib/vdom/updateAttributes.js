import { addEvent, removeEvent } from "../event";

export function updateAttributes(
  target,
  originNewProps = {},
  originOldProps = {},
) {
  if (originNewProps) {
    // 새로운 props를 순회하면서 변경 또는 추가
    Object.entries(originNewProps).forEach(([key, value]) => {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();

        if (originOldProps[key] !== value) {
          addEvent(target, eventType, value);
        }
      } else {
        const attrName = key === "className" ? "class" : key;

        if (originOldProps[key] !== value) {
          target.setAttribute(attrName, value);
        }
      }
    });
  }

  if (originOldProps) {
    // 삭제된 props 제거
    Object.keys(originOldProps).forEach((key) => {
      if (!originNewProps || !(key in originNewProps)) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase();
          removeEvent(target, eventType, originOldProps[key]);
        } else {
          const attrName = key === "className" ? "class" : key;
          target.removeAttribute(attrName);
        }
      }
    });
  }
}
