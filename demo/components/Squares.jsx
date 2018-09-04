import Square from './Square';
import { arrayOf, getRandomInt, randomColor } from '../utils/util';

export default () =>
  arrayOf(1).map(() => {
    const id = getRandomInt(1, 10000);
    return (<Square
      id={id}
      key={id}
      x={getRandomInt(300, 500)}
      y={getRandomInt(0, 500)}
      r={getRandomInt(20, 40)}
      col={randomColor()}
    />);
  });
