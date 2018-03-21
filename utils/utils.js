/**
 * Returns children from either a function or children
 * @param {React.children} children
 * @param {React.Props} props
 */
const synthesizeChildren = (children, props) => {
  return typeof children === "function"
    ? children(props)
    : children && children;
};

export default {
  synthesizeChildren
};
