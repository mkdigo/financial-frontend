import React, { createContext, useEffect, useState } from 'react';
import AuthApi, { IUser } from '../api/AuthApi';
import { Loader } from '../components/Loader';
import { getToken } from '../helpers';

interface IAuthContext {
  authUser: IUser | undefined;
  setAuthUser: React.Dispatch<IUser>;
}

interface IProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<IAuthContext>({} as any);

const AuthProvider: React.FC<IProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState<IUser | undefined>();
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const token = getToken();

      if (token) {
        const api = new AuthApi();
        const response = await api.me();

        if (!response.success) return;

        setAuthUser(response.data.user);
      }

      setFirstLoad(false);
    })();
  }, []);

  if (firstLoad) return <Loader />;

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
