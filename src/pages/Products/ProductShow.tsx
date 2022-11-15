import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { IProduct, ProductApi } from '../../api/ProductApi';
import { Modal } from '../../components/Modal';
import { numberFormat } from '../../helpers';
import useAppContext from '../../hooks/useAppContext';

import { Layout } from '../../Layout';
import { Arrow90degLeft } from '../../svg/Arrow90degLeft';
import PencilSvg from '../../svg/PencilSvg';
import PrintSvg from '../../svg/PrintSvg';
import TrashSvg from '../../svg/TrashSvg';

type TLocationState = {
  product: IProduct;
};

const ProductShow: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const {
    currentModal,
    handleCloseModal,
    handleOpenModal,
    setLoading,
    handleError,
  } = useAppContext();
  const [product, setProduct] = useState<IProduct>({
    id: 0,
    barcode: '',
    ref: '',
    name: '',
    description: '',
    cost: 0,
    price: 0,
    note: '',
    quantity: 0,
  });

  const handleDelete = () => {
    handleOpenModal('delete');
  };

  const handleDeleteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    const api = new ProductApi();
    const response = await api.delete(product.id);
    setLoading(false);
    handleCloseModal();

    if (!response.success) {
      handleError(response.message);
      return;
    }

    navigate('/products');
  };

  useEffect(() => {
    const state = location.state as TLocationState;

    if (state?.product) {
      setProduct(state.product);
      return;
    }

    (async () => {
      setLoading(true);
      const api = new ProductApi();
      const response = await api.show(Number(params.id));
      setLoading(false);

      if (!response.success) {
        handleError(response.message);
        return;
      }

      setProduct(response.data.product);
    })();
  }, []);

  return (
    <Layout>
      <div className='title'>
        <h1>Detalhes do Produto</h1>

        <div className='tools'>
          <button type='button' onClick={() => navigate(-1)} title='Voltar'>
            <Arrow90degLeft />
          </button>
          <button type='button' onClick={() => window.print()} title='Imprimir'>
            <PrintSvg />
          </button>
          <button
            type='button'
            className='btn-primary'
            onClick={() =>
              navigate(`/products/${product.id}/edit`, { state: { product } })
            }
            title='Editar'
          >
            <PencilSvg />
          </button>
          <button type='button' className='btn-danger' onClick={handleDelete}>
            <TrashSvg />
          </button>
        </div>
      </div>

      <section className='data'>
        <ul className='card'>
          <li>
            <strong>ID</strong>
            <span>{product.id}</span>
          </li>
          <li>
            <strong title='Código de Barras'>Cód. Barras</strong>
            <span>{product.barcode}</span>
          </li>
          <li>
            <strong title='Código de Referência'>Cód. Ref.</strong>
            <span>{product.ref}</span>
          </li>
          <li>
            <strong>Name</strong>
            <span>{product.name}</span>
          </li>
          <li>
            <strong>Descrição</strong>
            <span>{product.description}</span>
          </li>
          <li>
            <strong>Custo</strong>
            <span>{numberFormat(product.cost)}</span>
          </li>
          <li>
            <strong>Venda</strong>
            <span>{numberFormat(product.price)}</span>
          </li>
          <li>
            <strong>Anotações</strong>
            <span>{product.note}</span>
          </li>
          <li>
            <strong>Estoque</strong>
            <span>{product.quantity}</span>
          </li>
        </ul>
      </section>

      {currentModal === 'delete' && (
        <Modal>
          <h2>Excluir Produto</h2>

          <form onSubmit={handleDeleteSubmit}>
            <ul>
              <li className='center'>Tem certeza que deseja excluir?</li>
              <li>
                <button
                  type='button'
                  className='btn-danger'
                  onClick={handleCloseModal}
                >
                  Não
                </button>
                <button type='submit' className='btn-primary'>
                  Sim
                </button>
              </li>
            </ul>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export { ProductShow };
