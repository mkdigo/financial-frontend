import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAppContext from '../../hooks/useAppContext';
import { IProduct, ProductApi } from '../../api/ProductApi';
import { numberFormat } from '../../helpers';

import { Layout } from '../../Layout';

import PlusSvg from '../../svg/PlusSvg';
import SearchSvg from '../../svg/SearchSvg';
import PrintSvg from '../../svg/PrintSvg';

const Products: React.FC = () => {
  const { setLoading, handleError, handleCloseModal } = useAppContext();
  const navigate = useNavigate();

  const [filterData, setFilterData] = useState({
    search: '',
    barcode: '',
    ref: '',
  });

  const [products, setProducts] = useState<IProduct[]>([]);

  const getProducts = useCallback(async () => {
    setLoading(true);
    const api = new ProductApi();
    const response = await api.get(filterData);
    setLoading(false);

    if (!response.success) {
      handleError(response.message);
      return;
    }

    setProducts(response.data.products);
  }, [filterData]);

  const handleFilterInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFilterData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFilterSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    getProducts();
  };

  const handleProductShow = (product: IProduct) => {
    navigate(`/products/${product.id}`, { state: { product } });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Layout>
      <div className='title'>
        <h1>Produtos</h1>

        <div className='tools'>
          <button type='button' onClick={() => window.print()} title='Imprimir'>
            <PrintSvg />
          </button>
          <button
            type='button'
            className='btn-primary'
            onClick={() => navigate('/products/new')}
            title='Novo'
          >
            <PlusSvg />
          </button>
        </div>
      </div>

      <section className='filters'>
        <form onSubmit={handleFilterSubmit}>
          <input
            type='search'
            name='search'
            value={filterData.search}
            onChange={handleFilterInputChange}
            placeholder='Busca'
          />
          <input
            type='barcode'
            name='barcode'
            value={filterData.barcode}
            onChange={handleFilterInputChange}
            placeholder='Código Barras'
          />
          <input
            type='ref'
            name='ref'
            value={filterData.ref}
            onChange={handleFilterInputChange}
            placeholder='Referência'
          />
          <button type='submit'>
            <SearchSvg />
          </button>
        </form>
      </section>

      <section className='data'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Fornecedor</th>
              <th>Preço</th>
              <th>Estoque</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} onClick={() => handleProductShow(product)}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.provider?.name}</td>
                <td>{numberFormat(product.price)}</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
};

export { Products };
