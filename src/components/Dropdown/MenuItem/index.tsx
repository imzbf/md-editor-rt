const MenuItem = ({
  children,
  onClick,
}: {
  children: JSX.Element | string;
  onClick: () => void;
}) => (
  <li className="dropdown-menu-item" onClick={onClick}>
    {children}
  </li>
);

export default MenuItem;
