import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAppContext from '../../hooks/useAppContext';
import ProviderApi, { IProvider } from '../../api/ProviderApi';

import { Layout } from '../../Layout';

import PencilSvg from '../../svg/PencilSvg';
import PlusSvg from '../../svg/PlusSvg';
import SearchSvg from '../../svg/SearchSvg';
import TrashSvg from '../../svg/TrashSvg';
import { Modal } from '../../components/Modal';

const Providers: React.FC = () => {
  const navigate = useNavigate();
  const {
    handleOpenModal,
    handleCloseModal,
    currentModal,
    setLoading,
    handleError,
    done,
  } = useAppContext();
  const [filterData, setFilterData] = useState({
    search: '',
  });
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [providerDeleteId, setProviderDeleteId] = useState<number>(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const api = new ProviderApi();
      const response = await api.get();
      setLoading(false);

      if (response.success) setProviders(response.data.providers);
    })();
  }, []);

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

    setLoading(true);
    const api = new ProviderApi();
    const response = await api.get(filterData);
    setLoading(false);

    if (!response.success) {
      handleError(response.message);
      return;
    }

    setProviders(response.data.providers);
  };

  const handleEdit = (provider: IProvider): void => {
    navigate('/providers/edit', {
      state: {
        provider,
      },
    });
  };

  const handleDeleteModal = (id: number): void => {
    setProviderDeleteId(id);
    handleOpenModal('delete');
  };

  const handleDeleteSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    const api = new ProviderApi();
    const response = await api.delete(providerDeleteId);
    setLoading(false);

    if (!response.success) {
      handleError(response.message);
      return;
    }

    const data = providers.filter(
      (provider) => provider.id !== providerDeleteId
    );
    setProviders(data);

    handleCloseModal();
    done();
  };

  return (
    <Layout>
      <div className='title'>
        <h1>Fornecedores</h1>

        <div className='tools'>
          <button
            type='button'
            className='btn-primary'
            onClick={() => navigate('/providers/new')}
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
          <button type='submit'>
            <SearchSvg />
          </button>
        </form>
      </section>

      <section className='data'>
        {providers.map((provider) => (
          <ul className='card' key={provider.id}>
            <li>
              <strong>ID:</strong>
              <span>{provider.id}</span>
            </li>
            <li>
              <strong>Nome:</strong>
              <span>{provider.name}</span>
            </li>
            <li>
              <strong>Email:</strong>
              <span>{provider.email}</span>
            </li>
            <li>
              <strong>Telefone:</strong>
              <span>{provider.phone}</span>
            </li>
            <li>
              <strong>Celular:</strong>
              <span>{provider.cellphone}</span>
            </li>
            <li>
              <strong>Estado:</strong>
              <span>{provider.state}</span>
            </li>
            <li>
              <strong>Cidade:</strong>
              <span>{provider.city}</span>
            </li>
            <li>
              <strong>Endereço:</strong>
              <span>{provider.address}</span>
            </li>
            <li>
              <strong>Anotações:</strong>
              <span style={{ whiteSpace: 'pre' }}>{provider.note}</span>
            </li>
            <div className='card-buttons'>
              <button type='button' onClick={() => handleEdit(provider)}>
                <PencilSvg />
              </button>
              <button
                type='button'
                className='btn-danger'
                onClick={() => handleDeleteModal(provider.id)}
              >
                <TrashSvg />
              </button>
            </div>
          </ul>
        ))}
      </section>

      {currentModal === 'delete' && (
        <Modal>
          <h2>Excluir Fornecedor</h2>

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

export { Providers };
