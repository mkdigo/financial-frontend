import React, { Dispatch } from 'react';
import XSquareSvg from '../../svg/XSquareSvg';

import styles from './styles.module.scss';

const Error: React.FC<{ message: string; setError: Dispatch<boolean> }> = ({
  message,
  setError,
}) => {
  const handleClose = (): void => {
    setError(false);
  };

  return (
    <div className={styles.container}>
      <div>
        <h2>Error</h2>

        <p>{message}</p>

        <button type='button' onClick={handleClose}>
          <XSquareSvg />
        </button>
      </div>
    </div>
  );
};

export { Error };
