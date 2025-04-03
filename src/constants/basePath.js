const isProd = location.hostname.includes("github.io");
const isHashMode = location.pathname.includes("index.hash.html");
const BASE_PATH = isProd ? "/front_5th_chapter1-2" : "";

export { isProd, isHashMode, BASE_PATH };
