const Menu = ({ children }: { children: JSX.Element | string }) => (
  <ul className="dropdown-menu">{children}</ul>
);

export default Menu;
