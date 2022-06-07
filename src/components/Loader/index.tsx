import React from 'react';
import styles from './styles.module.scss';

const balls: number[] = [];

for (let i = 1; i <= 20; i++) {
  balls.push(i);
}

const Loader: React.FC = () => {
  return (
    <div className={styles.loader}>
      <div>
        {balls.map((ball, index) => (
          <span
            className={styles.ball}
            key={ball}
            style={{ ['--ball-number' as any]: index }}
          ></span>
        ))}
      </div>
    </div>
  );
};

export { Loader };
