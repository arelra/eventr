import { mount } from 'enzyme';
import React from 'react';

import * as eventRegistry from '../../src/event-registry';
import configureEnzymeAdapter from '../enzyme-adapter';
import withEventHandlers from '../../src/hoc/withEventHandlers';

beforeAll(configureEnzymeAdapter);

const FakeComponent = props => <div {...props} />;

describe('withEventHandlers', () => {
  let Component;
  let props;
  let registerHandler = jest.fn();
  let unregisterHandler = jest.fn();
  let clickHandler = () => ({ selected: true });
  beforeEach(() => {
    Component = withEventHandlers(
      {
        selected: false,
      },
      {
        clickOutside: () => ({ selected: false }),
        click: clickHandler,
      },
    )(FakeComponent);

    props = {
      id: 'id',
    };

    eventRegistry.default = jest.fn(() => ({
      registerHandler,
      unregisterHandler,
    }));
  });

  test('sets initial state', () => {
    const component = mount(<Component {...props} />);
    expect(component.state()).toEqual({ selected: false });
  });

  test('on componentDidMount register handlers that set state when invoked', () => {
    mount(<Component {...props} />);
    expect(registerHandler).toHaveBeenCalledWith(
      'id',
      'click',
      expect.any(Function),
    );
    expect(registerHandler).toHaveBeenCalledWith(
      'id',
      'clickOutside',
      expect.any(Function),
    );
  });

  test('on componentDidMount register handlers that set state when invoked', () => {
    mount(<Component {...props} />).unmount();
    expect(unregisterHandler).toHaveBeenCalledWith('id', 'click');
    expect(unregisterHandler).toHaveBeenCalledWith('id', 'clickOutside');
  });
});
