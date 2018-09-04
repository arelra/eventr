/**
 * The EventRegistry is a singleton which provides an interface for
 * 1) one listener component to attach and detach
 * 2) many components to register and unregister event handlers
 *
 * The registry has an internal map of component ids to handler functions e.g.
 * eventMap = {
 *  componentId1: {
 *    click: () => {doSomething},
 *    clickOutside: () => {doSomething},
 *  },
 *  componentId2: {
 *    click: () => {doSomething},
 *    clickOutside: () => {doSomething},
 *  },
 * }
 *
 * When an event is captured on the listener component it is passed
 * to handleEvent to attempt to invoke a handler in the eventMap.
 *
 * Why do we need this? We want to:
 *  declaratively describe event handlers on components
 *  simplify event handling logic in components
 *  enable group behaviour between different components
 *    i.e. clicking on one component will close others
 *  allow custom logic to determine clicks
 *    i.e. clicking on a highlight rectangle
 *  avoid complex shouldComponentUpdate logic
 *  avoid large centralised UI state
 */

import { addHandler, removeHandler } from './handlers';
import { handleEvent } from './handle-event';

let instance;
let listenerElement;
const eventMap = {};

const applyEvents = (callback, eventHandler) =>
  ['click', 'mouseup', 'mousedown'].forEach((event) => {
    callback(event, eventHandler);
  });

const init = () => {
  const handleEventProxy = ev =>
    handleEvent(ev, listenerElement, eventMap);
  return {
    registerHandler: (id, eventType, handler) =>
      addHandler(id, eventType, handler, eventMap),
    unregisterHandler: (id, eventType) =>
      removeHandler(id, eventType, eventMap),
    attachListener: (listenerElementRef) => {
      listenerElement = listenerElementRef;
      applyEvents(listenerElementRef.addEventListener, handleEventProxy);
    },
    detachListener: listenerElementRef =>
      applyEvents(listenerElementRef.removeEventListener, handleEventProxy),
  };
};

const getInstance = () => {
  if (!instance) {
    instance = init();
  }
  return instance;
};

export default getInstance;
