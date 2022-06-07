import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../../api/AuthApi';
import { AppContext } from '../../contexts/AppProvider';
import styles from './styles.module.scss';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { handleError } = useContext(AppContext);

  useEffect(() => {
    AuthApi.logout().then((response) => {
      if (response.success) navigate('/');
      else handleError('Algo de errado aconteceu, tente novamente.');
    });
  }, [handleError, navigate]);

  return (
    <main className={styles.container}>
      <h1>Disconnecting...</h1>
    </main>
  );
};

export { Logout };
