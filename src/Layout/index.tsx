import React from 'react';
import { SideBar } from '../components/SideBar';

import styles from './styles.module.scss';

interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <main className={styles.main}>
      <SideBar />
      <div className={styles.container}>{children}</div>
    </main>
  );
};

export { Layout };
