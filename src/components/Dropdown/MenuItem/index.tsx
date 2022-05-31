import React from 'react';

export default ({
  children,
  onClick
}: {
  children: JSX.Element | string;
  onClick: () => void;
}) => (
  <li className="dropdown-menu-item" onClick={onClick}>
    {children}
  </li>
);
