import { Api, Response } from './';

export type TGroupName =
  | 'assets'
  | 'liabilities'
  | 'equity'
  | 'income_statement';

export interface IGroup {
  id: number;
  name: TGroupName;
  description: string | null;
}

export default class GroupApi extends Api {
  public async get(): Promise<Response<{ groups: IGroup[] }>> {
    return await this.request.get('/groups');
  }
}
