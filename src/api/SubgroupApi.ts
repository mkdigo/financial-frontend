import { Api, Response } from './';
import { IGroup } from './GroupApi';

export type TSubgroupName =
  | 'current_assets'
  | 'long_term_assets'
  | 'property'
  | 'other_assets'
  | 'current_liabilities'
  | 'long_term_liabilities'
  | 'other_liabilities'
  | 'equity'
  | 'revenues'
  | 'expenses'
  | 'tax';

export interface ISubgroup {
  id: number;
  name: TSubgroupName;
  description: string | null;
  group: IGroup;
}

export default class SubgroupApi extends Api {
  public async get(): Promise<Response<{ subgroups: ISubgroup[] }>> {
    return this.request.get(`/subgroups`);
  }
}
