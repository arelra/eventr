// TODO
// add listeners to all events on listening component
// pass event to handlers
// ui test for unregister and detach
// groups
// readme
// rxjs to handle selection event
// fire selection start and end event

const addHandler = (componentId, eventType, handler, eventMap) => {
  /* eslint-disable no-param-reassign */
  if (!eventMap[componentId]) {
    eventMap[componentId] = {};
  }
  eventMap[componentId][eventType] = handler;
  /* eslint-enable no-param-reassign */
};

const removeHandler = (componentId, eventType, eventMap) => {
  if (eventMap[componentId] && eventMap[componentId][eventType]) {
    delete eventMap[componentId][eventType]; // eslint-disable-line no-param-reassign
  }
};

const invokeHandler = (targetId, eventType, eventMap) => {
  const componentHandlers = eventMap[targetId];
  if (componentHandlers && componentHandlers[eventType]) {
    componentHandlers[eventType]();
  }
};

const fireClickOutsides = (targetId, eventMap) => {
  const componentHandlers = Object.entries(eventMap);
  componentHandlers.forEach(([k, v]) => {
    if (k !== targetId && v.clickOutside) {
      v.clickOutside();
    }
  });
};

const eventRegistrySingleton = (function () { // eslint-disable-line func-names
  let instance;
  const eventMap = {};
  const init = () => {
    const addEventHandler = (id, eventType, handler) =>
      addHandler(id, eventType, handler, eventMap);
    const handleEvent = (e) => {
      const targetId = e.target.id;
      invokeHandler(targetId, e.type, eventMap);
      fireClickOutsides(targetId, eventMap);
    };
    return {
      register: (id, eventType, handler) => addEventHandler(id, eventType, handler),
      unregister: (id, eventType) => removeHandler(id, eventType, eventMap),
      attach: subscriberRef => (subscriberRef.addEventListener('click', handleEvent)),
      detach: subscriberRef => (subscriberRef.removeEventListener('click', handleEvent)),
      log: () => console.log(eventMap), // eslint-disable-line no-console
    };
  };
  return {
    getInstance: () => {
      if (!instance) {
        instance = init();
        window.eventr = instance;
      }
      return instance;
    },
  };
}());

export default eventRegistrySingleton;
