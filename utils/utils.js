import { InteractionManager } from 'react-native';

/**
 * Returns children from either a function or children
 * @param {React.children} children
 * @param {React.Props} props
 */
export const synthesizeChildren = (children, props) => {
  return typeof children === 'function'
    ? children(props)
    : children && children;
};

export const runAfterInteractions = () =>
  new Promise(resolve => {
    InteractionManager.runAfterInteractions(() => {
      resolve();
    });
  });

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const delayExec = (ms, func) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(func());
    }, ms);
  });

export default { synthesizeChildren };
