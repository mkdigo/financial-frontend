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
  state: string | null;
  city: string | null;
  address: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
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
}
