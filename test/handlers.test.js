import {
  addHandler,
  invokeHandler,
  removeHandler,
  invokeOutsideClickHandlers,
  invokeCustomClickHandlers,
} from '../src/handlers';

describe('event handlers', () => {
  describe('addHandler', () => {
    test('adds a handler for a new component', () => {
      const eventMap = {};
      addHandler('someId', 'someEventType', 'handler', eventMap);
      expect('handler').toBe(eventMap.someId.someEventType);
    });

    test('adds to the handlers for an existing component', () => {
      const eventMap = {
        someId: {
          someEventType: 'someHandler',
        },
      };
      addHandler('someId', 'anotherEventType', 'anotherHandler', eventMap);
      expect('someHandler').toBe(eventMap.someId.someEventType);
      expect('anotherHandler').toBe(eventMap.someId.anotherEventType);
    });
  });

  describe('removeHandler', () => {
    test('removes a handler', () => {
      const eventMap = {
        someId: {
          someEventType: 'someHandler',
          anotherEventType: 'anotherHandler',
        },
      };
      removeHandler('someId', 'anotherEventType', eventMap);
      expect(typeof eventMap.someId.anotherEventType === 'undefined').toBe(
        true,
      );
      expect('someHandler').toBe(eventMap.someId.someEventType);
    });

    test('removes all handlers if removal creates an empty handler map', () => {
      const eventMap = {
        someId: {
          someEventType: 'someHandler',
        },
      };
      removeHandler('someId', 'someEventType', eventMap);
      expect(typeof eventMap.someId === 'undefined').toBe(true);
    });
  });

  describe('invokeHandler', () => {
    test('invokes the handler for a registered element id and event type', () => {
      const element = {
        id: 'someId',
      };
      const event = {
        type: 'someEventType',
      };
      const eventMap = {
        someId: {
          someEventType: jest.fn(),
        },
      };
      invokeHandler(element, event, eventMap);
      expect(eventMap.someId.someEventType).toBeCalledWith(event);
    });

    test('DOES NOT invoke a handler for an event target id that is not registered', () => {
      const element = {
        id: 'someId',
      };
      const event = {
        type: 'someEventType',
      };
      const eventMap = {
        anotherId: {
          someEventType: jest.fn(),
        },
      };
      invokeHandler(element, event, eventMap);
      expect(eventMap.anotherId.someEventType).toHaveBeenCalledTimes(0);
    });

    test('DOES NOT invoke a handler for an event type that is not registered', () => {
      const element = {
        id: 'someId',
      };
      const event = {
        type: 'anotherEventType',
      };
      const eventMap = {
        someId: {
          someEventType: jest.fn(),
        },
      };
      invokeHandler(element, event, eventMap);
      expect(eventMap.someId.someEventType).toHaveBeenCalledTimes(0);
    });
  });

  describe('invokeCustomClickHandlers', () => {
    test('invokes ALL "clickOutside" handlers for elements NOT matching the event target id', () => {
      const event = {
        target: {
          id: 'someId',
        },
        type: 'someEvent',
      };
      const eventMap = {
        someId: {
          someEventType: jest.fn(),
          someEventType2: jest.fn(),
        },
        anotherId: {
          clickOutside: jest.fn(),
        },
        anotherId2: {
          clickOutside: jest.fn(),
        },
        anotherId3: {
          anotherEventType: jest.fn(),
        },
      };
      invokeOutsideClickHandlers(event.target.id, eventMap);

      expect(eventMap.someId.someEventType).toHaveBeenCalledTimes(0);
      expect(eventMap.someId.someEventType2).toHaveBeenCalledTimes(0);
      expect(eventMap.anotherId.clickOutside).toHaveBeenCalledTimes(1);
      expect(eventMap.anotherId2.clickOutside).toHaveBeenCalledTimes(1);
      expect(eventMap.anotherId3.anotherEventType).toHaveBeenCalledTimes(0);
    });

    test('invokes ALL "customClickHandler" handlers with the event', () => {
      const event = {
        target: {
          id: 'someId',
        },
        type: 'someEvent',
      };
      const eventMap = {
        someId: {
          someEventType: jest.fn(),
          customClickHandler: jest.fn(),
        },
        anotherId: {
          customClickHandler: jest.fn(),
        },
        anotherId3: {
          anotherEventType: jest.fn(),
        },
      };
      invokeCustomClickHandlers(event, eventMap);

      expect(eventMap.someId.someEventType).toHaveBeenCalledTimes(0);
      expect(eventMap.someId.customClickHandler).toBeCalledWith(event);
      expect(eventMap.someId.customClickHandler).toHaveBeenCalledTimes(1);
      expect(eventMap.anotherId.customClickHandler).toBeCalledWith(event);
      expect(eventMap.anotherId.customClickHandler).toHaveBeenCalledTimes(1);
      expect(eventMap.anotherId3.anotherEventType).toHaveBeenCalledTimes(0);
    });
  });
});
