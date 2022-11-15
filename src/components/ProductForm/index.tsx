import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAppContext from '../../hooks/useAppContext';
import {
  IProduct,
  IProductRequestData,
  ProductApi,
} from '../../api/ProductApi';
import ProviderApi, { IProvider } from '../../api/ProviderApi';
import { makeInteger, numberFormat } from '../../helpers';

interface Props {
  product?: IProduct;
}

const ProductForm: React.FC<Props> = ({ product }: Props) => {
  const navigate = useNavigate();
  const { handleError, setLoading } = useAppContext();

  const [providers, setProviders] = useState<IProvider[]>([]);
  const [data, setData] = useState<IProductRequestData>({
    id: 0,
    provider_id: 0,
    name: '',
    description: '',
    note: '',
    barcode: '',
    ref: '',
    cost: 0,
    price: 0,
  });

  const handleTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.preventDefault();

    setData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleNumberInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    event.preventDefault();

    setData((prev) => ({
      ...prev,
      [event.target.name]: makeInteger(event.target.value),
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    const api = new ProductApi();
    const response = product ? await api.update(data) : await api.store(data);
    setLoading(false);

    if (!response.success) {
      handleError(response.message);
      return;
    }

    navigate(`/products/${response.data.product.id}`, {
      state: { product: response.data.product },
    });
  };

  useEffect(() => {
    (async () => {
      if (product)
        setData({
          id: product.id,
          provider_id: product.provider?.id ?? 0,
          name: product.name,
          description: product.description,
          note: product.note,
          barcode: product.barcode,
          ref: product.ref,
          cost: product.cost,
          price: product.price,
        });

      const api = new ProviderApi();
      const response = await api.get();

      if (!response.success) {
        handleError('Não foi possível carregar os fornecedores.');
        return;
      }

      setProviders(response.data.providers);
    })();
  }, []);

  return (
    <form className='form' onSubmit={handleFormSubmit}>
      <ul>
        <li>
          <label className='required'>
            <strong>Fornecedor</strong>
            <select
              name='provider_id'
              onChange={handleNumberInputChange}
              value={data.provider_id}
              required
            >
              <option value=''></option>
              {providers.map((provider) => (
                <option value={provider.id} key={`provider-${provider.id}`}>
                  {provider.name}
                </option>
              ))}
            </select>
          </label>
        </li>
        <li>
          <label>
            <strong>Código de Barras</strong>
            <input
              type='text'
              name='barcode'
              value={data.barcode ?? ''}
              onChange={handleTextInputChange}
            />
          </label>
        </li>
        <li>
          <label>
            <strong>Referência</strong>
            <input
              type='text'
              name='ref'
              value={data.ref ?? ''}
              onChange={handleTextInputChange}
            />
          </label>
        </li>
        <li>
          <label className='required'>
            <strong>Nome</strong>
            <input
              type='text'
              name='name'
              value={data.name}
              onChange={handleTextInputChange}
              required
            />
          </label>
        </li>
        <li>
          <label>
            <strong>Descrição</strong>
            <textarea
              name='description'
              value={data.description ?? ''}
              onChange={handleTextInputChange}
            />
          </label>
        </li>
        <li>
          <label className='required'>
            <strong>Custo</strong>
            <input
              type='text'
              name='cost'
              value={numberFormat(Number(data.cost))}
              onChange={handleNumberInputChange}
              required
            />
          </label>
        </li>
        <li>
          <label className='required'>
            <strong>Venda</strong>
            <input
              type='text'
              name='price'
              value={numberFormat(Number(data.price))}
              onChange={handleNumberInputChange}
              required
            />
          </label>
        </li>
        <li>
          <label>
            <strong>Anotações</strong>
            <textarea
              name='note'
              value={data.note ?? ''}
              onChange={handleTextInputChange}
            />
          </label>
        </li>
        <li>
          <button
            type='button'
            className='btn-danger'
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button type='submit' className='btn-primary'>
            Enviar
          </button>
        </li>
      </ul>
    </form>
  );
};

export { ProductForm };
