import { mount } from 'enzyme';
import React from 'react';

import * as eventRegistry from '../../src/event-registry';
import configureEnzymeAdapter from '../enzyme-adapter';
import withEventListener from '../../src/hoc/withEventListener';

beforeAll(configureEnzymeAdapter);

const FakeComponent = () => <div />;

describe('withEventHandlers', () => {
  let Component;
  let attachListener;
  let detachListener;

  beforeEach(() => {
    Component = withEventListener(FakeComponent);
    attachListener = jest.fn();
    detachListener = jest.fn();

    eventRegistry.default = jest.fn(() => ({
      attachListener,
      detachListener,
    }));
  });

  test('should attach listener to ref.current', () => {
    mount(<Component />);
    expect(attachListener).toBeCalledTimes(1);
  });

  test('should detach listener to ref.current', () => {
    mount(<Component />).unmount();
    expect(detachListener).toBeCalledTimes(1);
  });
});
