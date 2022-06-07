import React from 'react';

import { Layout } from '../../Layout';
import { EntryAdd } from '../../components/EntryAdd';
import { EntryEdit } from '../../components/EntryEdit';
import { Modal } from '../../components/Modal';

import PencilSvg from '../../svg/PencilSvg';
import PlusSvg from '../../svg/PlusSvg';
import SearchSvg from '../../svg/SearchSvg';
import TrashSvg from '../../svg/TrashSvg';
import PrintSvg from '../../svg/PrintSvg';

import { numberFormat } from '../../helpers';
import useAppContext from '../../hooks/useAppContext';
import useEntries from './useEntries';

import styles from './styles.module.scss';

const Entries: React.FC = () => {
  const {
    filterData,
    accounts,
    entries,
    handleSetEntries,
    handleSearchSubmit,
    handleFilterInputChange,
    editEntry,
    handleEditModal,
    handleDeleteModal,
    handleDeleteSubmit,
  } = useEntries();

  const { handleCloseModal, handleOpenModal, currentModal } = useAppContext();

  return (
    <Layout>
      <div className='title'>
        <h1>Lançamentos</h1>

        <div className='tools'>
          <button type='button' onClick={() => window.print()} title='Imprimir'>
            <PrintSvg />
          </button>
          <button
            type='button'
            className='btn-primary'
            onClick={() => handleOpenModal('add')}
            title='Novo'
          >
            <PlusSvg />
          </button>
        </div>
      </div>

      <section className='filters'>
        <form onSubmit={handleSearchSubmit}>
          <div>
            <label htmlFor='EntryFilterStart'>Início</label>
            <input
              type='date'
              name='start'
              id='EntryFilterStart'
              value={filterData.start}
              onChange={handleFilterInputChange}
            />
          </div>
          <div>
            <label htmlFor='EntryFilterEnd'>Fim</label>
            <input
              type='date'
              name='end'
              id='EntryFilterEnd'
              value={filterData.end}
              onChange={handleFilterInputChange}
            />
          </div>
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

      <section className={styles.data}>
        {entries.map((entry) => (
          <ul className='card' key={entry.id}>
            <li>
              <strong>Data:</strong>
              <span>{entry.inclusion}</span>
            </li>
            <li>
              <strong>Débito:</strong>
              <span>{entry.debit_name}</span>
            </li>
            <li>
              <strong>Crédito:</strong>
              <span>{entry.credit_name}</span>
            </li>
            <li>
              <strong>Valor:</strong>
              <span>{numberFormat(entry.value)}</span>
            </li>
            <li>
              <strong>Notas:</strong>
              <span style={{ whiteSpace: 'pre' }}>{entry.note}</span>
            </li>
            <div className='card-buttons'>
              <button type='button' onClick={() => handleEditModal(entry)}>
                <PencilSvg />
              </button>
              <button
                type='button'
                className='btn-danger'
                onClick={() => handleDeleteModal(entry.id)}
              >
                <TrashSvg />
              </button>
            </div>
          </ul>
        ))}
      </section>

      {currentModal === 'add' && (
        <Modal>
          <EntryAdd accounts={accounts} handleSetEntries={handleSetEntries} />
        </Modal>
      )}

      {currentModal === 'edit' && editEntry && (
        <Modal>
          <EntryEdit
            accounts={accounts}
            handleSetEntries={handleSetEntries}
            entry={editEntry}
          />
        </Modal>
      )}

      {currentModal === 'delete' && (
        <Modal>
          <h2>Excluir Lançamento</h2>

          <form action='' onSubmit={handleDeleteSubmit}>
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

export { Entries };
