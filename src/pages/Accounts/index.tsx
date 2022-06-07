import React from 'react';

import { Layout } from '../../Layout';
import { AccountAddForm } from '../../components/AccountAddForm';
import { AccountEditForm } from '../../components/AccountEditForm';
import { Modal } from '../../components/Modal';

import PencilSvg from '../../svg/PencilSvg';
import PlusSvg from '../../svg/PlusSvg';
import TrashSvg from '../../svg/TrashSvg';

import useAccounts from './useAccounts';
import useAppContext from '../../hooks/useAppContext';

import { groupTranslation } from '../../translations/groupTranslation';
import { subgroupTranslation } from '../../translations/subgroupTranslation';

import styles from './styles.module.scss';

const Accounts: React.FC = () => {
  const { currentModal, handleCloseModal, handleOpenModal, language } =
    useAppContext();

  const {
    accounts,
    groups,
    subgroups,
    params,
    handleFilterChange,
    handleAddSubmit,
    editAccount,
    handleEditAccount,
    handleEditSubmit,
    handleDeleteAccount,
    handleDeleteSubmit,
    searchRef,
  } = useAccounts();

  return (
    <Layout>
      <div className='title'>
        <h1>Contas</h1>

        <div className='tools'>
          <button type='button' onClick={() => handleOpenModal('add')}>
            <PlusSvg />
          </button>
        </div>
      </div>

      <ul className={styles.filters}>
        <h3>Filtros</h3>
        <li>
          <label htmlFor='filter-group'>Grupo</label>
          <select
            id='filter-group'
            name='group_id'
            value={params.group_id}
            onChange={handleFilterChange}
          >
            <option value=''></option>
            {groups.map((group) => (
              <option value={group.id} key={group.id}>
                {groupTranslation[language].getName(group.name)}
              </option>
            ))}
          </select>
        </li>
        <li>
          <label htmlFor='filter-subgroup'>Subgrupo:</label>
          <select
            id='filter-subgroup'
            name='subgroup_id'
            value={params.subgroup_id}
            onChange={handleFilterChange}
          >
            <option value=''></option>
            {subgroups.map((subgroup) => (
              <option value={subgroup.id} key={subgroup.id}>
                {subgroupTranslation[language].getName(subgroup.name)}
              </option>
            ))}
          </select>
        </li>
        <li>
          <label htmlFor='filter-search'>Buscar:</label>
          <input
            type='text'
            id='filter-search'
            name='search'
            value={params.search}
            onChange={handleFilterChange}
            ref={searchRef}
          />
        </li>
      </ul>

      {accounts.map((account) => (
        <ul className='card' key={account.id}>
          <li>
            <strong>Nome:</strong>
            {account.name}
          </li>
          <li>
            <strong>Grupo:</strong>
            {groupTranslation[language].getName(account.group.name)}
          </li>
          <li>
            <strong>Subgrupo:</strong>
            {subgroupTranslation[language].getName(account.subgroup.name)}
          </li>
          <div className='card-buttons'>
            <button type='button' onClick={() => handleEditAccount(account)}>
              <PencilSvg />
            </button>
            <button
              type='button'
              className='btn-danger'
              onClick={() => handleDeleteAccount(account.id)}
            >
              <TrashSvg />
            </button>
          </div>
        </ul>
      ))}

      {currentModal === 'add' && (
        <Modal>
          <AccountAddForm
            groups={groups}
            subgroups={subgroups}
            handleAddSubmit={handleAddSubmit}
          />
        </Modal>
      )}
      {currentModal === 'edit' && (
        <Modal>
          <AccountEditForm
            groups={groups}
            subgroups={subgroups}
            account={editAccount}
            handleEditSubmit={handleEditSubmit}
          />
        </Modal>
      )}
      {currentModal === 'delete' && (
        <Modal>
          <h2>Excluir Conta</h2>

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

export { Accounts };
