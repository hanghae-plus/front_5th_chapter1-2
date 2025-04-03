export const router = {
  value: null,
  get() {
    return this.value;
  },
  set(newValue) {
    this.value = newValue;
  },
};

export const BASE_PATH =
  import.meta.env.MODE === "production" ? "/front_5th_chapter1-2" : "";
