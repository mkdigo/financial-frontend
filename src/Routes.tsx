import React from 'react';
import {
  Routes as Switch,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import useAuthContext from './hooks/useAuthContext';

import { Home } from './pages/Home';
import { BalanceSheet } from './pages/BalanceSheet';
import { Accounts } from './pages/Accounts';
import { Entries } from './pages/Entries';
import { NotFound } from './pages/NotFound';
import { Expenses } from './pages/Expenses';
import { Providers } from './pages/Providers';
import { ProviderAdd } from './pages/Providers/ProviderAdd';
import { ProviderEdit } from './pages/Providers/ProviderEdit';
import { Products } from './pages/Products';
import { ProductAdd } from './pages/Products/ProductAdd';
import { ProductEdit } from './pages/Products/ProductEdit';
import { ProductShow } from './pages/Products/ProductShow';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { authUser } = useAuthContext();
  let location = useLocation();

  if (!authUser) {
    return <Navigate to='/' state={{ from: location }} replace />;
  }

  return children;
}

type AuthRouteType = {
  path: string;
  text?: string;
  element: JSX.Element;
};

export const authRoutes: AuthRouteType[] = [
  {
    path: '/balance_sheet',
    text: 'Balanço Patrimonial',
    element: <BalanceSheet />,
  },
  {
    path: '/accounts',
    text: 'Contas',
    element: <Accounts />,
  },
  {
    path: '/entries',
    text: 'Lançamentos',
    element: <Entries />,
  },
  {
    path: '/expenses',
    text: 'Despesas',
    element: <Expenses />,
  },
  // {
  //   path: '/payables',
  //   text: 'Contas a Pagar',
  //   element: ,
  // },
  // {
  //   path: '/receivables',
  //   text: 'Contas a Receber',
  //   element: ,
  // },
  {
    path: '/providers',
    text: 'Fornecedores',
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
  {
    path: '/products',
    text: 'Produtos',
    element: <Products />,
  },
  {
    path: '/products/:id',
    element: <ProductShow />,
  },
  {
    path: '/products/new',
    element: <ProductAdd />,
  },
  {
    path: '/products/:id/edit',
    element: <ProductEdit />,
  },
  // {
  //   path: '/reports',
  //   text: 'Relatórios',
  //   element: ,
  // },
];

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/' element={<Home />} />

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
