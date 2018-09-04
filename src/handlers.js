export const addHandler = (componentId, eventType, handler, eventMap) => {
  if (!eventMap[componentId]) {
    eventMap[componentId] = {}; // eslint-disable-line no-param-reassign
  }
  eventMap[componentId][eventType] = handler; // eslint-disable-line no-param-reassign
};

export const removeHandler = (componentId, eventType, eventMap) => {
  if (eventMap[componentId] && eventMap[componentId][eventType]) {
    delete eventMap[componentId][eventType]; // eslint-disable-line no-param-reassign
    const handlerCount = Object.keys(eventMap[componentId]).length;
    if (handlerCount === 0) {
      delete eventMap[componentId]; //eslint-disable-line
    }
  }
};

export const invokeHandler = (element, event, eventMap) => {
  const componentHandlers = eventMap[element.id];
  if (componentHandlers && componentHandlers[event.type]) {
    componentHandlers[event.type](event);
  }
};

export const invokeOutsideClickHandlers = (eventTargetId, eventMap) =>
  Object.entries(eventMap).forEach(([registeredComponentId, handlers]) => {
    if (registeredComponentId !== eventTargetId && handlers.clickOutside) {
      handlers.clickOutside();
    }
  });

export const invokeCustomClickHandlers = (event, eventMap) =>
  Object.values(eventMap).forEach(handlers =>
    handlers.customClickHandler && handlers.customClickHandler(event));
