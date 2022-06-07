import React, { useState } from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

import type { LinkProps } from 'react-router-dom';

import LogoSvg from '../../svg/LogoSvg';
import MenuSvg from '../../svg/MenuSvg';

import styles from './styles.module.scss';

const links: TLink[] = [
  {
    to: '/balance_sheet',
    text: 'Balanço Patrimonial',
  },
  {
    to: '/accounts',
    text: 'Contas',
  },
  {
    to: '/entries',
    text: 'Lançamentos',
  },
  {
    to: '/revenues',
    text: 'Receitas',
  },
  {
    to: '/expenses',
    text: 'Despesas',
  },
  {
    to: '/payables',
    text: 'Contas a Pagar',
  },
  {
    to: '/receivables',
    text: 'Contas a Receber',
  },
  {
    to: '/providers',
    text: 'Fornecedores',
  },
  {
    to: '/products',
    text: 'Produtos',
  },
  {
    to: '/reports',
    text: 'Relatórios',
  },
  {
    to: '/logout',
    text: 'Sair',
  },
];

const CustomLink: React.FC<LinkProps> = ({ children, to, ...props }) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link className={match ? styles.currentPage : ''} to={to} {...props}>
      {children}
    </Link>
  );
};

type TLink = {
  to: string;
  text: string;
};

const SideBar: React.FC = () => {
  const [menuActived, setMenuActived] = useState<boolean>(false);

  const handleMenuActive = (): void => {
    setMenuActived(!menuActived);
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
        {links.map((link) => (
          <li key={link.to}>
            <CustomLink to={link.to}>{link.text}</CustomLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { SideBar };
