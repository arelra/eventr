import elementsBetween from './elements-helper';
import {
  invokeHandler,
  invokeCustomClickHandlers,
  invokeOutsideClickHandlers,
} from './handlers';

const getState = state => ({
  invokedHandler: false,
  stoppedPropagation: false,
  targetElementsFound: false,
  ...state,
});

const isRightClick = event =>
  event.button && event.button === 2 && event.type === 'mousedown';

const hasStopPropagation = element =>
  element.hasAttribute('data-event-stop-propagation');

const handlerExistsForEvent = (el, event, eventMap) =>
  eventMap[el.id] && eventMap[el.id][event.type];

/**
 * Attempts to invoke a handler in the eventMap for the given event
 *
 * Gets all elements between event.target and the listener
 * Loop over the elements checking each one:
 *   1) for a 'data-event-stop-propagation' attribute
 *   2) if the element.id has a handler for this event.type in the eventMap
 *
 * If a handler exists it is invoked and all outside click handlers are invoked
 *
 * Returns an object describing the invocation attempt e.g.
 * {
 *   invokedHandler: false,
 *   stoppedPropagation: false,
 *   targetElementsFound: false,
 * }
 *
 * @param {Event} event
 * @param {Element} listenerElement
 * @param {object} eventMap
 * @returns {object}
 */
export const attemptHandlerInvocationForEvent = (event, listenerElement, eventMap) => {
  const elements = elementsBetween(event.target, listenerElement);
  const targetElementsFound = Boolean(elements.length);
  for (let i = 0; i < elements.length; i += 1) {
    const element = elements[i];

    if (hasStopPropagation(element)) {
      return getState({ stoppedPropagation: true, targetElementsFound });
    }

    if (handlerExistsForEvent(element, event, eventMap) && !isRightClick(event)) {
      invokeHandler(element, event, eventMap);
      invokeOutsideClickHandlers(event.target.id, eventMap);
      return getState({ invokedHandler: true, targetElementsFound });
    }
  }
  return getState({ targetElementsFound });
};

/**
 * handleEvent calls attemptHandlerInvocationForEvent which returns an object
 * describing the outcome of the handler invocation attempt e.g.
 *
 * invokedHandler:
 *  A handler was invoked for this event
 *
 * stoppedPropagation:
 *  An element between event.target to the listenerElement directed to block the event from
 *  being handled. Useful for child components that need to stay open despite internal clicks
 *
 * targetElementsFound:
 *  False when the event.target does not exist or the path from event.target to the listener
 *  is invalid. This can happen when a prior event handler causes the element to be deleted
 *
 * if (targetElementsFound && !invokedHandler && !stoppedPropagation)
 *  ie didn't invoke or stop progration
 *  invoke all the click outside handlers to cause all open components to close
 *  invoke all custom handlers which delegate click decisions to the component (used for highlights)
 *
 * @param {Event} event
 * @param {Element} listenerElement
 * @param {object} eventMap
 */
export const handleEvent = (event, listenerElement, eventMap) => {
  const {
    invokedHandler,
    stoppedPropagation,
    targetElementsFound,
  } = attemptHandlerInvocationForEvent(event, listenerElement, eventMap);

  const shouldClickOutside = targetElementsFound && !invokedHandler && !stoppedPropagation;
  if (shouldClickOutside) {
    invokeOutsideClickHandlers(event.target.id, eventMap);
    invokeCustomClickHandlers(event, eventMap);
  }
};
