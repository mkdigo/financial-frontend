import axios, { catchReturn, TResponse, setHeaders, responseError } from './';
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

export default class AccountApi {
  public static async get(
    params?: IAccountSearchParams
  ): Promise<TResponse<IAccount[]>> {
    try {
      const url = `/accounts`;
      const response = await axios.get(url, setHeaders(params));

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.accounts,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }

  public static async store(
    data: IAccountEntryData
  ): Promise<TResponse<IAccount>> {
    try {
      const response = await axios.post('/accounts', data);

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.account,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }

  public static async update(
    data: IAccountEntryData
  ): Promise<TResponse<IAccount>> {
    try {
      const response = await axios.put(`/accounts/${data.id}`, data);

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.account,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }

  public static async destroy(id: number): Promise<TResponse<null>> {
    try {
      const response = await axios.delete(`/accounts/${id}`);

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }
}
