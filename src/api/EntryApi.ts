import axios, { catchReturn, TResponse, setHeaders, responseError } from './';

export interface IEntryRequest {
  id?: number;
  inclusion: string;
  debit_id: number;
  credit_id: number;
  value: number;
  note: string;
}

export interface IEntry {
  id: number;
  inclusion: string;
  debit_id: number;
  debit_name: string;
  credit_id: number;
  credit_name: string;
  value: number;
  note: string;
}

export interface IEntrySearchParams {
  start: string;
  end: string;
  search: string;
}

export default class EntryApi {
  public static async get(
    params: IEntrySearchParams
  ): Promise<TResponse<IEntry[]>> {
    try {
      const response = await axios.get(`/entries`, setHeaders(params));

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.entries,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }

  public static async store(data: IEntryRequest): Promise<TResponse<IEntry>> {
    try {
      const response = await axios.post('/entries', data);

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.entry,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }

  public static async update(data: IEntryRequest): Promise<TResponse<IEntry>> {
    try {
      const response = await axios.put(`/entries/${data.id}`, data);

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.entry,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }

  public static async destroy(id: number): Promise<TResponse<null>> {
    try {
      const response = await axios.delete(`/entries/${id}`);

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }

  public static async getExpenses(
    params: IEntrySearchParams
  ): Promise<TResponse<IEntry[]>> {
    try {
      const response = await axios.get(`/entries/expenses`, setHeaders(params));

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.entries,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }
}
