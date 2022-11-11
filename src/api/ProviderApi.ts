import { Api, Response } from './';

interface IProviderSearchParams {
  search: string;
}

export interface IProvider {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  cellphone: string | null;
  zipcode: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface IProviderAddData {
  name: string;
  email: string;
  phone: string;
  cellphone: string;
  zipcode: string;
  state: string;
  city: string;
  address: string;
  note: string;
}

export default class ProviderApi extends Api {
  public async get(
    params?: IProviderSearchParams
  ): Promise<Response<{ providers: IProvider[] }>> {
    return await this.request.get('/providers', { params });
  }

  public async store(
    data: IProviderAddData
  ): Promise<Response<{ provider: IProvider }>> {
    return await this.request.post('/providers', data);
  }

  public async update(
    data: IProvider
  ): Promise<Response<{ provider: IProvider }>> {
    return this.request.put(`/providers/${data.id}`, data);
  }

  public async delete(id: number): Promise<Response<null>> {
    return this.request.delete(`/providers/${id}`);
  }
}
