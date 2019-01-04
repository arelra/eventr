import elementsBetween from '../src/elements-helper';

describe('elements between', () => {
  test('child element that is the same as the parent returns an array with the child', () => {
    const element = {};
    expect([element]).toEqual(elementsBetween(element, element));
  });

  test('child element that has no parent returns an empty array', () => {
    const childElement = {};
    expect([]).toEqual(elementsBetween(childElement, {}));
  });

  test('child element with a parent that DOES match the required parent returns both', () => {
    const childElement = {
      parentNode: {},
    };
    expect([childElement, childElement.parentNode]).toEqual(
      elementsBetween(childElement, childElement.parentNode),
    );
  });

  test('child element with an ancestor that DOES match the required parent returns all elements between', () => {
    const childElement = {
      parentNode: {
        parentNode: {},
      },
    };
    expect([
      childElement,
      childElement.parentNode,
      childElement.parentNode.parentNode,
    ]).toEqual(
      elementsBetween(childElement, childElement.parentNode.parentNode),
    );
  });

  test('child element with parents that DO NOT match the required parent returns an empty array', () => {
    const childElement = {
      parentNode: {},
    };
    expect([]).toEqual(elementsBetween(childElement, {}));
  });
});
