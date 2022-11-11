import { Api, Response } from './';
import { IGroup } from './GroupApi';
import { ISubgroup } from './SubgroupApi';

export interface IAccount {
  id: number;
  group_id: number;
  subgroup_id: number;
  name: string;
  description?: string | null;
  group: IGroup;
  subgroup: ISubgroup;
}

export interface IAccountEntryData {
  id?: number;
  group_id: number | '';
  subgroup_id: number | '';
  name: string;
  description?: string | null;
}

export interface IAccountSearchParams {
  group_id: string;
  subgroup_id: string;
  search: string;
}

export default class AccountApi extends Api {
  public async get(
    params?: IAccountSearchParams
  ): Promise<Response<{ accounts: IAccount[] }>> {
    return await this.request.get('/accounts', { params });
  }

  public async store(
    data: IAccountEntryData
  ): Promise<Response<{ account: IAccount }>> {
    return await this.request.post('/accounts', data);
  }

  public async update(
    data: IAccountEntryData
  ): Promise<Response<{ account: IAccount }>> {
    return await this.request.put(`/accounts/${data.id}`, data);
  }

  public async destroy(id: number): Promise<Response<null>> {
    return await this.request.delete(`/accounts/${id}`);
  }
}
