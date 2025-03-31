const map = new Map();
const A = () => {};
const B = () => {};

map.set("div", A);
map.set("span", B);
map.set("div", B);
console.log(map);
map.forEach((b, a) => console.log(a, b));
