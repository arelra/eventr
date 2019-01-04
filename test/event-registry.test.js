import * as handlers from '../src/handlers';
import eventRegistry from '../src/event-registry';

jest.mock('../src/handle-event');

describe('event registry', () => {
  let eventRegistryInstance;
  let props;

  beforeEach(() => {
    handlers.addHandler = jest.fn();
    handlers.removeHandler = jest.fn();
    eventRegistryInstance = eventRegistry();
    props = {
      id: 'id',
      eventType: 'click',
      handler: () => {},
      listenerEl: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    };
  });

  test('registerHandler invokes addHandler', () => {
    const { id, eventType, handler } = props;
    eventRegistryInstance.registerHandler(id, eventType, handler);
    expect(handlers.addHandler).toBeCalledWith(id, eventType, handler, {});
  });

  test('unregisterHandler invokes removeHandler', () => {
    const { id, eventType } = props;
    eventRegistryInstance.unregisterHandler(id, eventType);
    expect(handlers.removeHandler).toBeCalledWith(id, eventType, {});
  });

  test('attachListener invokes addEventListener', () => {
    const {
      listenerEl,
      listenerEl: { addEventListener },
    } = props;
    eventRegistryInstance.attachListener(listenerEl);
    expect(addEventListener).toHaveBeenCalledTimes(3);
  });

  test('detachListener invokes removeEventListener', () => {
    const {
      listenerEl,
      listenerEl: { removeEventListener },
    } = props;
    eventRegistryInstance.detachListener(listenerEl);
    expect(removeEventListener).toHaveBeenCalledTimes(3);
  });
});
