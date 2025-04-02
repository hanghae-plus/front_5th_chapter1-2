import { addEvent, removeEvent } from "../event";
import { Props } from "./types";

function handleEventAttribute(
  target: HTMLElement,
  key: string,
  newValue: (event: Event) => void,
  oldValue: (event: Event) => void,
) {
  const eventType = key.slice(2).toLowerCase();
  if (oldValue !== newValue) {
    addEvent(target, eventType, newValue);
  }
}

function handleNormalAttribute(
  target: HTMLElement,
  key: string,
  newValue: string,
  oldValue: string,
) {
  const attrName = key === "className" ? "class" : key;
  if (oldValue !== newValue) {
    target.setAttribute(attrName, newValue);
  }
}

function removeEventAttribute(
  target: HTMLElement,
  key: string,
  oldValue: (event: Event) => void,
) {
  const eventType = key.slice(2).toLowerCase();
  removeEvent(target, eventType, oldValue);
}

function removeNormalAttribute(target: HTMLElement, key: string) {
  const attrName = key === "className" ? "class" : key;
  target.removeAttribute(attrName);
}

export function updateAttributes(
  target: HTMLElement,
  originNewProps: Props,
  originOldProps: Props,
) {
  if (originNewProps) {
    Object.entries(originNewProps).forEach(([key, value]) => {
      if (key.startsWith("on")) {
        // 이벤트 핸들러인 경우
        handleEventAttribute(
          target,
          key,
          value as (event: Event) => void,
          (originOldProps?.[key] as (event: Event) => void) || (() => {}),
        );
      } else {
        // 일반 속성인 경우
        handleNormalAttribute(
          target,
          key,
          value as string,
          (originOldProps?.[key] as string) || "",
        );
      }
    });
  }

  if (originOldProps) {
    Object.keys(originOldProps).forEach((key) => {
      if (!(originNewProps && key in originNewProps)) {
        if (key.startsWith("on")) {
          // 이벤트 핸들러인 경우
          removeEventAttribute(
            target,
            key,
            originOldProps[key] as (event: Event) => void,
          );
        } else {
          // 일반 속성인 경우
          removeNormalAttribute(target, key);
        }
      }
    });
  }
}
