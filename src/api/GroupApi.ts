import axios, { catchReturn, responseError, TResponse } from './';

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

export default class GroupApi {
  public static async get(): Promise<TResponse<IGroup[]>> {
    try {
      const response = await axios.get('/groups');

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.groups,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }
}
