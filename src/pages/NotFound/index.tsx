import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundSvg from '../../svg/NotFoundSvg';

import './styles.scss';

const NotFound: React.FC = () => {
  return (
    <main className='notFoundContainer'>
      <h1>Pagina não encontrada!</h1>
      <Link to='/'>Voltar para home.</Link>
      <NotFoundSvg />
    </main>
  );
};

export { NotFound };
