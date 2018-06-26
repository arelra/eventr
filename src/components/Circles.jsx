import Circle from './Circle';
import { arrayOf, getRandomInt, randomColor } from '../utils/util';

export default () =>
  arrayOf(20).map(() => {
    const id = getRandomInt(1, 10000);
    return (<Circle
      id={id}
      key={id}
      x={getRandomInt(0, 250)}
      y={getRandomInt(0, 500)}
      r={getRandomInt(20, 40)}
      col={randomColor()}
    />);
  });
