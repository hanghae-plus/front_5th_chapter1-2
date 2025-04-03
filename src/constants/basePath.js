const isProduct = process.env.NODE_DEV === "production";

export const BASE_PATH = isProduct ? "/front_5th_chapter1-2" : "";
