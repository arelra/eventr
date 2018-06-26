export const arrayOf = length =>
  Array.from({ length }, (v, k) => k + 1);

export const getRandomInt = (min, max) => {
  const floor = max - min;
  return Math.floor(Math.random() * (floor + 1)) + min;
};

export const randomColor = () =>
  `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`;
