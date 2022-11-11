import React, { FormEvent, useEffect, useState } from 'react';
import AccountApi, { IAccount } from '../../api/AccountApi';
import EntryApi, { IEntry, IEntrySearchParams } from '../../api/EntryApi';
import { DateTime } from '../../helpers';
import useAppContext from '../../hooks/useAppContext';

interface IUseEntries {
  filterData: IEntrySearchParams;
  accounts: IAccount[];
  entries: IEntry[];
  handleSetEntries: (entry: IEntry, edit?: boolean) => void;
  handleFilterInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (event: FormEvent) => void;
  editEntry: IEntry | undefined;
  handleEditModal: (entry: IEntry) => void;
  handleDeleteModal: (id: number) => void;
  handleDeleteSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const dateTime = new DateTime();
dateTime.subtractMonth(6);
dateTime.setDay(1);

export default function useEntries(): IUseEntries {
  const { setLoading, done, handleCloseModal, handleOpenModal, handleError } =
    useAppContext();

  const [filterData, setFilterData] = useState<IEntrySearchParams>({
    search: '',
    start: dateTime.getDate(),
    end: dateTime.getToday(),
  });
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [entries, setEntries] = useState<IEntry[]>([]);

  const [editEntry, setEditEntry] = useState<IEntry>();
  const [deleteEntryId, setDeleteEntryId] = useState<number>(0);

  // Load Accounts and Entries
  useEffect(() => {
    (async () => {
      setLoading(true);
      const accountApi = new AccountApi();
      const entryApi = new EntryApi();

      const [accountReponse, entryResponse] = await Promise.all([
        accountApi.get(),
        entryApi.get(filterData),
      ]);

      setLoading(false);

      if (accountReponse.success) setAccounts(accountReponse.data.accounts);
      if (entryResponse.success) setEntries(entryResponse.data.entries);
    })();
  }, []);

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

  const handleFilterInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFilterData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSearchSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    const api = new EntryApi();

    const response = await api.get(filterData);
    setLoading(false);

    if (!response.success) {
      handleError(response.message);
      return;
    }

    setEntries(response.data.entries);
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

  return {
    filterData,
    accounts,
    entries,
    handleSetEntries,
    handleFilterInputChange,
    handleSearchSubmit,
    editEntry,
    handleEditModal,
    handleDeleteModal,
    handleDeleteSubmit,
  };
}
