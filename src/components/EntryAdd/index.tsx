import React, { useContext, useRef, useState } from 'react';
import { IAccount } from '../../api/AccountApi';
import EntryApi, { IEntry, IEntryRequest } from '../../api/EntryApi';
import { AppContext } from '../../contexts/AppProvider';
import { makeInteger, today } from '../../helpers';
import { EntryForm } from '../EntryForm';

const resetData: IEntryRequest = {
  inclusion: today(),
  debit_id: 0,
  credit_id: 0,
  value: 0,
  note: '',
};

interface IProps {
  handleSetEntries: (entry: IEntry) => void;
  accounts: IAccount[];
}

const EntryAdd: React.FC<IProps> = ({ handleSetEntries, accounts }) => {
  const { setLoading, done, handleError } = useContext(AppContext);
  const inputDateRef: React.MutableRefObject<HTMLInputElement | null> =
    useRef(null);

  const [entryFormData, setEntryFormData] = useState<IEntryRequest>(resetData);

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

  const handleEntrySubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setLoading(true);

    EntryApi.store(entryFormData).then((response) => {
      if (response.success) {
        setEntryFormData((prev) => ({
          ...prev,
          debit_id: 0,
          credit_id: 0,
          value: 0,
          note: '',
        }));

        inputDateRef.current?.focus();

        handleSetEntries(response.data);

        done();
      } else {
        handleError(response.message);
      }
      setLoading(false);
    });
  };

  return (
    <>
      <h2>Lançamento</h2>

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

export { EntryAdd };
