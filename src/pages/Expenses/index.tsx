import React, { useContext, useEffect, useState } from 'react';

import AccountApi, { IAccount } from '../../api/AccountApi';
import EntryApi, {
  IEntry,
  IEntryRequest,
  IEntrySearchParams,
} from '../../api/EntryApi';
import { AppContext } from '../../contexts/AppProvider';
import { DateTime, makeInteger, numberFormat, today } from '../../helpers';

import { Layout } from '../../Layout';
import { Modal } from '../../components/Modal';
import { EntryEdit } from '../../components/EntryEdit';

import PencilSvg from '../../svg/PencilSvg';
import PlusSvg from '../../svg/PlusSvg';
import SearchSvg from '../../svg/SearchSvg';
import TrashSvg from '../../svg/TrashSvg';

import styles from './styles.module.scss';

const dateTime = new DateTime();
dateTime.subtractMonth(6);
dateTime.setDay(1);

const Expenses: React.FC = () => {
  const [entryToggle, setEntryToggle] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [debitAccounts, setDebitAccounts] = useState<IAccount[]>([]);
  const [creditAccounts, setCreditAccounts] = useState<IAccount[]>([]);
  const [entries, setEntries] = useState<IEntry[]>([]);
  const [entryFormData, setEntryFormData] = useState<IEntryRequest>({
    inclusion: today(),
    debit_id: 0,
    credit_id: 0,
    value: 0,
    note: '',
  });
  const [filterData, setFilterData] = useState<IEntrySearchParams>({
    search: '',
    start: dateTime.getDate(),
    end: dateTime.getToday(),
  });
  const [editEntry, setEditEntry] = useState<IEntry>();
  const [deleteEntryId, setDeleteEntryId] = useState<number>(0);

  const {
    setLoading,
    handleError,
    done,
    handleCloseModal,
    handleOpenModal,
    currentModal,
  } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const api = new AccountApi();

      const response = await api.get();

      if (!response.success) return;

      setAccounts(response.data.accounts);

      const debits = response.data.accounts.filter(
        (account) => account.subgroup_id === 10 || account.subgroup_id === 11
      );
      setDebitAccounts(debits);

      const credits = response.data.accounts.filter(
        (account) => account.subgroup_id === 1
      );
      setCreditAccounts(credits);
    })();
  }, []);

  const getEntries = async () => {
    setLoading(true);

    const api = new EntryApi();
    const response = await api.getExpenses(filterData);
    setLoading(false);

    if (!response.success) return;

    setEntries(response.data.entries);
  };

  useEffect(() => {
    getEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFilterData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    getEntries();
  };

  const resetFormData = (): void => {
    setEntryFormData({
      inclusion: entryFormData.inclusion,
      debit_id: 0,
      credit_id: 0,
      value: 0,
      note: '',
    });
  };

  const handleSetEntries = (entry: IEntry, edit: boolean = false): void => {
    if (edit) {
      const newEntries = entries.map((newEntry) => {
        if (newEntry.id === entry.id) {
          return entry;
        } else return newEntry;
      });
      setEntries(newEntries);
    } else {
      const newEntries = entries;
      newEntries.unshift(entry);
      setEntries(newEntries);
    }
  };

  const handleEntrySubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    const api = new EntryApi();
    const response = await api.store(entryFormData);
    setLoading(false);

    if (!response.success) {
      handleError(response.message);
      return;
    }

    handleSetEntries(response.data.entry);
    resetFormData();
    done();
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    let value: string | number = event.target.value;

    if (event.target.dataset.maskNumber) {
      value = makeInteger(event.target.value);
    }

    setEntryFormData((prev) => ({
      ...prev,
      [event.target.name]: value,
    }));
  };

  const handleEditModal = (entry: IEntry): void => {
    handleOpenModal('edit');
    setEditEntry(entry);
  };

  const handleDeleteModal = (id: number): void => {
    handleOpenModal('delete');
    setDeleteEntryId(id);
  };

  const handleDeleteSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    const api = new EntryApi();
    const response = await api.destroy(deleteEntryId);
    setLoading(false);

    if (!response.success) {
      handleError(response.message);
      return;
    }

    const newEntries = entries.filter((entry) => entry.id !== deleteEntryId);
    setEntries(newEntries);
    handleCloseModal();
    done();
  };

  return (
    <Layout>
      <div className='title'>
        <h1>Despesas</h1>

        <div className='tools'>
          <button type='button' onClick={() => setEntryToggle(!entryToggle)}>
            <PlusSvg />
          </button>
        </div>
      </div>

      <form
        className={styles.form}
        style={{ height: entryToggle ? 470 : 0 }}
        onSubmit={handleEntrySubmit}
      >
        <h2>Lançamento</h2>

        <li>
          <label htmlFor='date'>Data</label>
          <input
            type='date'
            name='inclusion'
            id='inclusion'
            value={entryFormData.inclusion}
            onChange={handleInputChange}
            required
          />
        </li>
        <li>
          <label htmlFor='debit_id'>Conta</label>
          <select
            name='debit_id'
            id='debit_id'
            value={entryFormData.debit_id}
            onChange={handleInputChange}
            required
          >
            <option value=''></option>
            {debitAccounts.map((account) => (
              <option value={account.id} key={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </li>
        <li>
          <label htmlFor='credit_id'>Forma de pagamento</label>
          <select
            name='credit_id'
            id='credit_id'
            value={entryFormData.credit_id}
            onChange={handleInputChange}
            required
          >
            <option value=''></option>
            {creditAccounts.map((account) => (
              <option value={account.id} key={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </li>
        <li>
          <label htmlFor='value'>Valor</label>
          <input
            type='text'
            name='value'
            data-mask-number
            value={numberFormat(entryFormData.value)}
            onChange={handleInputChange}
            required
          />
        </li>
        <li>
          <label htmlFor='note'>Notas</label>
          <textarea
            name='note'
            id='note'
            value={entryFormData.note}
            onChange={handleInputChange}
          />
        </li>
        <li>
          <button type='submit' className='btn-primary'>
            Adicionar
          </button>
        </li>
      </form>

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

      <section className='data'>
        {entries.map((entry) => (
          <ul className='card' key={entry.id}>
            <li>
              <strong>Data:</strong>
              {entry.inclusion}
            </li>
            <li>
              <strong>Débito:</strong>
              {entry.debit_name}
            </li>
            <li>
              <strong>Crédito:</strong>
              {entry.credit_name}
            </li>
            <li>
              <strong>Valor:</strong>
              {numberFormat(entry.value)}
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

export { Expenses };
