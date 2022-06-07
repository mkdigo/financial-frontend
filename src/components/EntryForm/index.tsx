import React from 'react';
import { IAccount } from '../../api/AccountApi';
import { IEntryRequest } from '../../api/EntryApi';
import { numberFormat } from '../../helpers';
import useAppContext from '../../hooks/useAppContext';

interface IProps {
  accounts: IAccount[];
  entryFormData: IEntryRequest;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  inputDateRef: React.MutableRefObject<HTMLInputElement | null>;
}

const EntryForm: React.FC<IProps> = ({
  handleSubmit,
  accounts,
  handleInputChange,
  entryFormData,
  inputDateRef,
}) => {
  const { handleCloseModal } = useAppContext();

  return (
    <form action='' onSubmit={handleSubmit}>
      <ul>
        <li>
          <label htmlFor='add-entry-inclusion'>Data:</label>
          <input
            type='inclusion'
            id='add-entry-inclusion'
            onChange={handleInputChange}
            value={entryFormData.inclusion}
            name='inclusion'
            ref={inputDateRef}
            required
          />
        </li>
        <li>
          <label htmlFor='add-entry-debit_id'>Débito:</label>
          <select
            value={entryFormData.debit_id}
            onChange={handleInputChange}
            id='add-entry-debit_id'
            name='debit_id'
            required
          >
            <option value=''></option>
            {accounts.map((account) => (
              <option value={account.id} key={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </li>
        <li>
          <label htmlFor='add-entry-credit'>Crédito:</label>
          <select
            value={entryFormData.credit_id}
            onChange={handleInputChange}
            id='add-entry-credit_id'
            name='credit_id'
            required
          >
            <option value=''></option>
            {accounts.map((account) => (
              <option value={account.id} key={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </li>
        <li>
          <label htmlFor='add-entry-value'>Valor:</label>
          <input
            type='text'
            id='add-entry-value'
            name='value'
            onChange={handleInputChange}
            value={numberFormat(entryFormData.value)}
            data-mask-number
            required
          />
        </li>
        <li>
          <label htmlFor='add-entry-note'>Notas:</label>
          <textarea
            id='add-entry-note'
            name='note'
            value={entryFormData.note ?? ''}
            onChange={handleInputChange}
          />
        </li>
        <li>
          <button
            type='button'
            className='btn-danger'
            onClick={handleCloseModal}
          >
            Fechar
          </button>
          <button type='submit' className='btn-primary'>
            Adicionar
          </button>
        </li>
      </ul>
    </form>
  );
};

export { EntryForm };
