import { ReactElement } from 'react';

const Menu = ({ children }: { children: ReactElement | string }) => <ul className="dropdown-menu">{children}</ul>;

export default Menu;
