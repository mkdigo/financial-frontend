import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAppContext from '../../hooks/useAppContext';
import useAuthContext from '../../hooks/useAuthContext';
import AuthApi, { ILogin } from '../../api/AuthApi';
import { setToken } from '../../helpers';

import LogoSvg from '../../svg/LogoSvg';

import styles from './styles.module.scss';

interface ILocationState {
  from: {
    pathname: string;
  };
}

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useAppContext();
  const { setAuthUser } = useAuthContext();

  const [data, setData] = useState<ILogin>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const api = new AuthApi();

    const response = await api.login(data);
    setLoading(false);

    if (!response.success) {
      setError(true);
      return;
    }

    let path = 'balance_sheet';
    if (location.state) {
      const { from } = location.state as ILocationState;
      path = from.pathname;
    }

    setToken(response.data.token);
    setAuthUser(response.data.user);
    navigate(path);
  };

  return (
    <main className={styles.main}>
      <section className={styles.left}>
        <header>
          <LogoSvg />
          <span>Financial Control</span>
        </header>

        <h1>Seu app de controle financeiro.</h1>

        <h2>Tenha toda movimentação financeira da sua empresa em suas mãos.</h2>

        <ul>
          <li>- Balanço Patrimonial</li>
          <li>- DRE</li>
          <li>- Controle de Estoque</li>
          <li>- Contas a pagar e receber</li>
          <li>- E muito mais</li>
        </ul>

        <p>Faça o login e desfrute.</p>
      </section>
      <section className={styles.right}>
        <div>
          <h2>Login</h2>

          <form action='' onSubmit={handleSubmit}>
            <ul>
              <li>
                <label htmlFor='username'>Usuário</label>
                <input
                  type='text'
                  id='username'
                  value={data.username}
                  onChange={handleInputChange}
                  required
                />
              </li>
              <li>
                <label htmlFor='password'>Senha</label>
                <input
                  type='password'
                  id='password'
                  value={data.password}
                  onChange={handleInputChange}
                  required
                />

                {error && (
                  <small className='error'>Usuário ou senha incorreta.</small>
                )}
              </li>
              <li>
                <button type='submit'>Entrar</button>
              </li>
            </ul>
          </form>
        </div>
      </section>
    </main>
  );
}
