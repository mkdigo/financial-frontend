import React from 'react';
import {
  Routes as Switch,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import useAuthContext from './hooks/useAuthContext';

import { Home } from './pages/Home';
import { Logout } from './pages/Logout';
import { BalanceSheet } from './pages/BalanceSheet';
import { Accounts } from './pages/Accounts';
import { Entries } from './pages/Entries';
import { NotFound } from './pages/NotFound';
import { Expenses } from './pages/Expenses';
import { Providers } from './pages/Providers';
import { ProviderAdd } from './pages/Providers/ProviderAdd';
import { ProviderEdit } from './pages/Providers/ProviderEdit';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { authUser } = useAuthContext();
  let location = useLocation();

  if (!authUser) {
    return <Navigate to='/' state={{ from: location }} replace />;
  }

  return children;
}

const authRoutes = [
  {
    path: '/balance_sheet',
    element: <BalanceSheet />,
  },
  {
    path: '/accounts',
    element: <Accounts />,
  },
  {
    path: '/entries',
    element: <Entries />,
  },
  {
    path: '/expenses',
    element: <Expenses />,
  },
  {
    path: '/providers',
    element: <Providers />,
  },
  {
    path: '/providers/new',
    element: <ProviderAdd />,
  },
  {
    path: '/providers/edit',
    element: <ProviderEdit />,
  },
];

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/' element={<Home />} />
      <Route path='/logout' element={<Logout />} />

      {authRoutes.map((route) => (
        <Route
          path={route.path}
          element={<RequireAuth>{route.element}</RequireAuth>}
          key={route.path}
        />
      ))}

      <Route path='*' element={<NotFound />} />
    </Switch>
  );
};

export { Routes };
