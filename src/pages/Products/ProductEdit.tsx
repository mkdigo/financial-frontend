import React from 'react';

import { Layout } from '../../Layout';
import { ProductForm } from '../../components/ProductForm';
import { IProduct } from '../../api/ProductApi';
import { useLocation } from 'react-router-dom';

type TLocationState = {
  product: IProduct;
};

const ProductEdit: React.FC = () => {
  const location = useLocation();
  const state = location.state as TLocationState;

  return (
    <Layout>
      <div className='title'>
        <h1>Editar Produto</h1>
      </div>

      <ProductForm product={state.product} />
    </Layout>
  );
};

export { ProductEdit };
