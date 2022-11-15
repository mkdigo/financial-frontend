import React from 'react';

import { Layout } from '../../Layout';
import { ProductForm } from '../../components/ProductForm';

const ProductAdd: React.FC = () => {
  return (
    <Layout>
      <div className='title'>
        <h1>Adicionar Produto</h1>
      </div>

      <ProductForm />
    </Layout>
  );
};

export { ProductAdd };
