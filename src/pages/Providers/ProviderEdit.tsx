import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ProviderApi, { IProvider } from '../../api/ProviderApi';
import { maskCellPhone, maskPhone, maskZipcode } from '../../helpers';
import useAppContext from '../../hooks/useAppContext';

import { Layout } from '../../Layout';
import { Arrow90degLeft } from '../../svg/Arrow90degLeft';

type TLocationState = {
  provider: IProvider;
};

const ProviderEdit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading, handleError, done } = useAppContext();
  const [data, setData] = useState<IProvider>({
    id: 0,
    name: '',
    email: '',
    phone: '',
    cellphone: '',
    zipcode: '',
    state: '',
    city: '',
    address: '',
    note: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    const { provider } = location.state as TLocationState;

    if (!provider) {
      navigate(-1);
      return;
    }

    setData(provider);
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    let value = event.target.value;

    if (event.target.dataset.maskPhone) value = maskPhone(value);
    if (event.target.dataset.maskCellphone) value = maskCellPhone(value);
    if (event.target.dataset.maskZipcode) value = maskZipcode(value);

    setData((prev) => ({
      ...prev,
      [event.target.name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setLoading(true);
    const api = new ProviderApi();
    const response = await api.update(data);
    setLoading(false);

    if (!response.success) {
      handleError(response.message);
      return;
    }

    done();
    navigate('/providers');
  };

  return (
    <Layout>
      <div className='title'>
        <h1>Editar fornecedor</h1>

        <div className='tools'>
          <button
            type='button'
            className='btn-secondary'
            onClick={() => navigate(-1)}
            title='Voltar a página de fornecedores'
          >
            <Arrow90degLeft />
          </button>
        </div>
      </div>

      <section className='form'>
        <form action='' onSubmit={handleSubmit}>
          <ul>
            <li>
              <label>
                <strong>ID:</strong>
                <input type='text' name='id' value={data.id} disabled />
              </label>
            </li>
            <li>
              <label>
                <strong>Nome:</strong>
                <input
                  type='text'
                  name='name'
                  value={data.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </li>
            <li>
              <label>
                <strong>Email:</strong>
                <input
                  type='email'
                  name='email'
                  value={data.email ?? ''}
                  onChange={handleInputChange}
                />
              </label>
            </li>
            <li>
              <label>
                <strong>Telefone:</strong>
                <input
                  type='text'
                  name='phone'
                  value={data.phone ?? ''}
                  onChange={handleInputChange}
                  maxLength={12}
                  data-mask-phone
                />
              </label>
            </li>
            <li>
              <label>
                <strong>Celular:</strong>
                <input
                  type='text'
                  name='cellphone'
                  value={data.cellphone ?? ''}
                  onChange={handleInputChange}
                  maxLength={13}
                  data-mask-cellphone
                />
              </label>
            </li>
            <li>
              <label>
                <strong>CEP:</strong>
                <input
                  type='text'
                  name='zipcode'
                  value={data.zipcode ?? ''}
                  onChange={handleInputChange}
                  maxLength={8}
                  data-mask-zipcode
                />
              </label>
            </li>
            <li>
              <label>
                <strong>Província:</strong>
                <input
                  type='text'
                  name='state'
                  value={data.state ?? ''}
                  onChange={handleInputChange}
                />
              </label>
            </li>
            <li>
              <label>
                <strong>Cidade:</strong>
                <input
                  type='text'
                  name='city'
                  value={data.city ?? ''}
                  onChange={handleInputChange}
                />
              </label>
            </li>
            <li>
              <label>
                <strong>Endereço:</strong>
                <input
                  type='text'
                  name='address'
                  value={data.address ?? ''}
                  onChange={handleInputChange}
                />
              </label>
            </li>
            <li>
              <label>
                <strong>Anotações:</strong>
                <textarea
                  name='note'
                  value={data.note ?? ''}
                  onChange={handleInputChange}
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
      </section>
    </Layout>
  );
};

export { ProviderEdit };
