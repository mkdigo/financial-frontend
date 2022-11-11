import React, { useContext, useRef, useState, useEffect } from 'react';

import { IAccount } from '../../api/AccountApi';
import EntryApi, { IEntry, IEntryRequest } from '../../api/EntryApi';
import { AppContext } from '../../contexts/AppProvider';
import { makeInteger } from '../../helpers';

import { EntryForm } from '../EntryForm';

interface IProps {
  handleSetEntries: (entry: IEntry, edit?: boolean) => void;
  accounts: IAccount[];
  entry: IEntry;
}

const EntryEdit: React.FC<IProps> = ({ handleSetEntries, accounts, entry }) => {
  const { setLoading, done, handleError, handleCloseModal } =
    useContext(AppContext);
  const inputDateRef: React.MutableRefObject<HTMLInputElement | null> =
    useRef(null);

  const [entryFormData, setEntryFormData] = useState<IEntryRequest>({
    id: entry.id,
    debit_id: entry.debit_id,
    credit_id: entry.credit_id,
    inclusion: entry.inclusion,
    note: entry.note,
    value: entry.value,
  });

  useEffect(() => {
    setEntryFormData({
      id: entry.id,
      debit_id: entry.debit_id,
      credit_id: entry.credit_id,
      inclusion: entry.inclusion,
      note: entry.note,
      value: entry.value,
    });
  }, [entry]);

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

  const handleEntrySubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    const api = new EntryApi();
    const response = await api.update(entryFormData);
    setLoading(false);

    if (!response.success) {
      handleError(response.message);
      return;
    }

    inputDateRef.current?.focus();

    handleCloseModal();
    handleSetEntries(response.data.entry, true);

    done();
  };

  return (
    <>
      <h2>Editar Lançamento</h2>

      <EntryForm
        accounts={accounts}
        handleSubmit={handleEntrySubmit}
        handleInputChange={handleInputChange}
        entryFormData={entryFormData}
        inputDateRef={inputDateRef}
      />
    </>
  );
};

export { EntryEdit };
