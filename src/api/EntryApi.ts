import { Api, Response } from './';

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

export default class EntryApi extends Api {
  public async get(
    params: IEntrySearchParams
  ): Promise<Response<{ entries: IEntry[] }>> {
    return await this.request.get(`/entries`, { params });
  }

  public async store(
    data: IEntryRequest
  ): Promise<Response<{ entry: IEntry }>> {
    return await this.request.post('/entries', data);
  }

  public async update(
    data: IEntryRequest
  ): Promise<Response<{ entry: IEntry }>> {
    return await this.request.put(`/entries/${data.id}`, data);
  }

  public async destroy(id: number): Promise<Response<null>> {
    return await this.request.delete(`/entries/${id}`);
  }

  public async getExpenses(
    params: IEntrySearchParams
  ): Promise<Response<{ entries: IEntry[] }>> {
    return await this.request.get(`/entries/expenses`, { params });
  }
}
