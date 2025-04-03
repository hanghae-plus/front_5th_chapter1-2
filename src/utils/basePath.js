const isProd = location.hostname.includes("github.io");
const isHashMode = location.href.includes("#/");
const BASE_PATH = isProd ? "/front_5th_chapter1-2" : "";

export { BASE_PATH, isHashMode, isProd };
