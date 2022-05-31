import React from 'react';
export default ({ children }: { children: JSX.Element | string }) => (
  <ul className="dropdown-menu">{children}</ul>
);
