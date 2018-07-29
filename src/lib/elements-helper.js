/**
 * Get all elements up the DOM tree until a matching parent is found
 * @param  {HTMLElement} childElement  Start element
 * @param  {HTMLElement} endParentElement End element
 * @return {HTMLElement[]} elements from target to matching parent
 */
const elementsBetween = (childElement, endParentElement) => {
  const elements = [];
  let currentParent;
  elements.push(childElement);

  if (childElement === endParentElement) {
    return elements;
  }

  currentParent = childElement.parentNode;

  while (currentParent) {
    elements.push(currentParent);
    if (currentParent === endParentElement) {
      return elements;
    }
    currentParent = currentParent.parentNode;
  }
  return [];
};

export default elementsBetween;
