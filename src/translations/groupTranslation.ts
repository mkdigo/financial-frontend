import { TLanguage } from '.';
import { TGroupName } from '../api/GroupApi';

interface IGroupTranlation {
  getName: (name: TGroupName) => string;
}

const groupTranslation: TLanguage<IGroupTranlation> = {
  ptBR: {
    getName: (name: TGroupName): string => {
      let translation: string = name;
      switch (name) {
        case 'assets':
          translation = 'Ativos';
          break;
        case 'liabilities':
          translation = 'Passivos';
          break;
        case 'equity':
          translation = 'Patrimônio Líquido';
          break;
        case 'income_statement':
          translation = 'Contas de Resultado';
          break;
      }

      return translation;
    },
  },
};

export { groupTranslation };
