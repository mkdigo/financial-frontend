import { ReactNode, useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppProvider';

import styles from './styles.module.scss';

interface ModalProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const { handleCloseModal } = useContext(AppContext);

  useEffect(() => {
    const handleClose = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') handleCloseModal();
    };

    window.addEventListener('keyup', handleClose);

    return () => {
      window.removeEventListener('keyup', handleClose);
    };
  }, [handleCloseModal]);

  const handleClick = (): void => handleCloseModal();

  return (
    <div className={styles.container} onClick={handleClick}>
      <div
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          event.stopPropagation()
        }
      >
        {children}
      </div>
    </div>
  );
};

export { Modal };
