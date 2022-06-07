import React, { createContext, Dispatch, useState } from 'react';
import { Done } from '../components/Done';
import { Error } from '../components/Error';
import { Loader } from '../components/Loader';
import { TLanguage } from '../translations';

export type TModal = '' | 'add' | 'edit' | 'delete';

interface IAppContext {
  language: keyof TLanguage<any>;
  setLanguage: Dispatch<keyof TLanguage<any>>;
  setLoading: Dispatch<boolean>;
  handleError: (message: string | undefined) => void;
  currentModal: TModal;
  handleOpenModal: (modal: TModal) => void;
  handleCloseModal: () => void;
  done: () => void;
}

interface IProps {
  children: React.ReactNode;
}

export const AppContext = createContext<IAppContext>({} as any);

const AppProvider: React.FC<IProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<keyof TLanguage<any>>('ptBR');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    'Algo de errado aconteceu'
  );
  const [renderDone, setRenderDone] = useState<boolean>(false);
  const [currentModal, setCurrentModal] = useState<TModal>('');

  const done = (): void => {
    setRenderDone(true);
    setTimeout(() => {
      setRenderDone(false);
    }, 600);
  };

  const handleError = (message: string | undefined): void => {
    setError(true);
    const text = message ? message : 'Something is wrong.';
    setErrorMessage(text);
  };

  const handleOpenModal = (modal: TModal): void => {
    setCurrentModal(modal);
  };

  const handleCloseModal = (): void => {
    setCurrentModal('');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        setLoading,
        handleError,
        currentModal,
        handleOpenModal,
        handleCloseModal,
        done,
      }}
    >
      {children}
      {loading && <Loader />}
      {error && <Error message={errorMessage} setError={setError} />}
      {renderDone && <Done />}
    </AppContext.Provider>
  );
};

export default AppProvider;
