import axios, { catchReturn, TResponse, setHeaders, responseError } from './';

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

export default class ProviderApi {
  public static async get(
    params?: IProviderSearchParams
  ): Promise<TResponse<IProvider[]>> {
    try {
      const url = `/providers`;
      const response = await axios.get(url, setHeaders(params));

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.providers,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }

  public static async store(
    data: IProviderAddData
  ): Promise<TResponse<IProvider>> {
    try {
      const url = `/providers`;
      const response = await axios.post(url, data);

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.provider,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }

  public static async update(data: IProvider): Promise<TResponse<IProvider>> {
    try {
      const url = `/providers/${data.id}`;
      const response = await axios.put(url, data);

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.provider,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }

  public static async delete(id: number): Promise<TResponse<null>> {
    try {
      const url = `/providers/${id}`;
      const response = await axios.delete(url);

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
