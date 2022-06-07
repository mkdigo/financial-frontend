import { TLanguage } from '.';
import { TSubgroupName } from '../api/SubgroupApi';

interface ISubgroupTranlation {
  getName: (name: TSubgroupName) => string;
}

const subgroupTranslation: TLanguage<ISubgroupTranlation> = {
  ptBR: {
    getName: (name: TSubgroupName): string => {
      let translation: string = name;
      switch (name) {
        case 'current_assets':
          translation = 'Ativo Circulante';
          break;
        case 'long_term_assets':
          translation = 'Realizavel a longo prazo';
          break;
        case 'property':
          translation = 'Ativo Permanente';
          break;
        case 'other_assets':
          translation = 'Outros Ativos';
          break;
        case 'current_liabilities':
          translation = 'Passivo Circulante';
          break;
        case 'long_term_liabilities':
          translation = 'Exigível a long prazo';
          break;
        case 'other_liabilities':
          translation = 'Outro Passivos';
          break;
        case 'equity':
          translation = 'Patrimônio Líquido';
          break;
        case 'revenues':
          translation = 'Receitas';
          break;
        case 'expenses':
          translation = 'Despesas';
          break;
        case 'tax':
          translation = 'Impostos';
          break;
      }

      return translation;
    },
  },
};

export { subgroupTranslation };
