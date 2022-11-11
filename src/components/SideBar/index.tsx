import React, { useState } from 'react';
import {
  Link,
  useMatch,
  useResolvedPath,
  LinkProps,
  useNavigate,
} from 'react-router-dom';

import { authRoutes } from '../../Routes';
import AuthApi from '../../api/AuthApi';
import useAppContext from '../../hooks/useAppContext';
import { removeToken } from '../../helpers';

import LogoSvg from '../../svg/LogoSvg';
import MenuSvg from '../../svg/MenuSvg';

import styles from './styles.module.scss';

const CustomLink: React.FC<LinkProps> = ({ children, to, ...props }) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link className={match ? styles.currentPage : ''} to={to} {...props}>
      {children}
    </Link>
  );
};

const SideBar: React.FC = () => {
  const { handleError, setLoading } = useAppContext();
  const navigate = useNavigate();
  const [menuActived, setMenuActived] = useState<boolean>(false);

  const handleMenuActive = (): void => {
    setMenuActived(!menuActived);
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    const api = new AuthApi();
    const response = await api.logout();
    setLoading(false);

    if (!response.success) {
      handleError('Algo de errado aconteceu, tente novamente.');
      return;
    }

    removeToken();
    navigate('/');
  };

  return (
    <nav
      className={`${styles.container} ${menuActived ? styles.menuActived : ''}`}
    >
      <h2>
        <LogoSvg />
        <span>Financial Control</span>
      </h2>

      <MenuSvg className={styles.menuIcon} onClick={handleMenuActive} />

      <ul
        className={menuActived ? styles.menuActived : ''}
        onClick={() => setMenuActived(false)}
      >
        {authRoutes.map((route) => {
          if (route.text)
            return (
              <li key={route.path}>
                <CustomLink to={route.path}>{route.text}</CustomLink>
              </li>
            );
        })}
        <li>
          <button onClick={logout}>Sair</button>
        </li>
      </ul>
    </nav>
  );
};

export { SideBar };
