import elementsBetween from '../src/elements-helper';
import * as handlers from '../src/handlers';
import {
  handleEvent,
  attemptHandlerInvocationForEvent,
} from '../src/handle-event';

jest.mock('../src/elements-helper');

describe('handle events', () => {
  beforeEach(() => {
    handlers.invokeHandler = jest.fn();
    handlers.invokeOutsideClickHandlers = jest.fn();
    handlers.invokeCustomClickHandlers = jest.fn();
  });

  describe('attemptHandlerInvocationForEvent', () => {
    test('should return targetElementsFound === false when no elements found for event', () => {
      const event = {
        target: {},
      };
      const listenerElement = {};
      // override the implementation
      elementsBetween.mockImplementation(() => []);

      const state = attemptHandlerInvocationForEvent(
        event,
        listenerElement,
        null,
      );
      expect(handlers.invokeHandler).toHaveBeenCalledTimes(0);
      expect(handlers.invokeOutsideClickHandlers).toHaveBeenCalledTimes(0);

      expect(state.targetElementsFound).toBe(false);
    });

    test('should return stoppedPropagation === true when an element with the attribute is encountered', () => {
      const event = {
        target: {
          id: 'someId',
        },
      };
      const listenerElement = {};
      const elements = [
        { hasAttribute: () => false },
        { hasAttribute: () => true },
      ];

      elementsBetween.mockImplementation(() => elements);

      const state = attemptHandlerInvocationForEvent(
        event,
        listenerElement,
        {},
      );
      expect(handlers.invokeHandler).toHaveBeenCalledTimes(0);
      expect(handlers.invokeOutsideClickHandlers).toHaveBeenCalledTimes(0);
      expect(state.targetElementsFound).toBe(true);
      expect(state.stoppedPropagation).toBe(true);
    });

    test('should return invokedHandler === true when an element has a handler that is invoked', () => {
      const event = {
        target: {
          id: 'someId',
        },
        type: 'someEventType',
      };
      const listenerElement = {};
      const elements = [
        { id: 'anotherId', hasAttribute: () => false },
        { id: 'someId', hasAttribute: () => false },
      ];
      const eventMap = {
        someId: {
          someEventType: jest.fn(),
        },
      };
      elementsBetween.mockImplementation(() => elements);

      const state = attemptHandlerInvocationForEvent(
        event,
        listenerElement,
        eventMap,
      );

      expect(handlers.invokeHandler).toBeCalledWith(
        elements[1],
        event,
        eventMap,
      );
      expect(handlers.invokeHandler).toHaveBeenCalledTimes(1);
      expect(handlers.invokeOutsideClickHandlers).toBeCalledWith(
        event.target.id,
        eventMap,
      );
      expect(handlers.invokeOutsideClickHandlers).toHaveBeenCalledTimes(1);
      expect(state.targetElementsFound).toBe(true);
      expect(state.invokedHandler).toBe(true);
    });
  });

  describe('handleEvent', () => {
    test(`handleEvent should invoke outside click handlers and custom click handlers when
\t\t\ta) event target elements exist AND
\t\t\tb) no handlers were invoked for this event AND
\t\t\tc) no stop propagation command was encountered`, () => {
      const event = {
        target: {
          id: 'anotherId',
        },
      };
      const listenerElement = {};
      const elements = [
        { id: 'anotherId', hasAttribute: () => false },
        { id: 'anotherId2', hasAttribute: () => false },
      ];
      const eventMap = {
        someId: {
          someEventType: jest.fn(),
        },
      };
      elementsBetween.mockImplementation(() => elements);

      handleEvent(event, listenerElement, eventMap);
      expect(handlers.invokeOutsideClickHandlers).toBeCalledWith(
        event.target.id,
        eventMap,
      );
      expect(handlers.invokeOutsideClickHandlers).toHaveBeenCalledTimes(1);
      expect(handlers.invokeCustomClickHandlers).toBeCalledWith(
        event,
        eventMap,
      );
      expect(handlers.invokeCustomClickHandlers).toHaveBeenCalledTimes(1);
    });
  });
});
