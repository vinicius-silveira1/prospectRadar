import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, wrapperId = 'portal-wrapper' }) => {
  const [wrapperElement, setWrapperElement] = useState(null);

  useEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      element = document.createElement('div');
      element.setAttribute('id', wrapperId);
      document.body.appendChild(element);
    }
    setWrapperElement(element);

    return () => {
      // cleanup
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
};

export default Portal;
