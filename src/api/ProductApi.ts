import { Api, Response } from '.';
import { IProvider } from './ProviderApi';

export interface IProduct {
  id: number;
  barcode: string | null;
  ref: string | null;
  name: string;
  description: string | null;
  cost: number;
  price: number;
  note: string | null;
  quantity: number;
  provider?: IProvider;
}

export interface IProductRequestData {
  id: number;
  provider_id: number;
  barcode: string | null;
  ref: string | null;
  name: string;
  description: string | null;
  cost: number;
  price: number;
  note: string | null;
}

interface IProductSearchParams {
  search?: string;
  barcode?: string;
  ref?: string;
}

export class ProductApi extends Api {
  public async get(
    params: IProductSearchParams
  ): Promise<Response<{ products: IProduct[] }>> {
    return await this.request.get('/products', { params });
  }

  public async show(id: number): Promise<Response<{ product: IProduct }>> {
    return await this.request.get(`/products/${id}`);
  }

  public async store(
    data: IProductRequestData
  ): Promise<Response<{ product: IProduct }>> {
    return await this.request.post('/products', data);
  }

  public async update(
    data: IProductRequestData
  ): Promise<Response<{ product: IProduct }>> {
    return await this.request.put(`/products/${data.id}`, data);
  }

  public async delete(id: number): Promise<Response<null>> {
    return await this.request.delete(`/products/${id}`);
  }
}
