import axios, { catchReturn, responseError, TResponse } from './';
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

export default class SubgroupApi {
  public static async get(): Promise<TResponse<ISubgroup[]>> {
    try {
      const url = `/subgroups`;
      const response = await axios.get(url);

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.subgroups,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }
}
