import { ReactElement } from 'react';

const MenuItem = ({ children, onClick }: { children: ReactElement | string; onClick: () => void }) => (
  <li className="dropdown-menu-item" onClick={onClick}>
    {children}
  </li>
);

export default MenuItem;
