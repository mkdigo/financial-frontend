import axios from 'axios';
import { getToken, removeToken } from '../helpers';

type ResponseOk<T> = {
  success: true;
  data: T;
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
};

type ResponseError = {
  success: false;
  message: string;
  errors: any;
  fields: string[] | null;
};

export type Response<T> = ResponseOk<T> | ResponseError;

export class Api {
  #request;

  constructor() {
    this.#request = axios.create({
      baseURL: import.meta.env.VITE_APP_API_URL,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      withCredentials: true,
    });

    this.#request.interceptors.response.use(
      (response) => {
        if (response.data.links)
          return this.responsePaginateResource(response.data);

        return this.responseResource(response.data.data);
      },
      (error) => {
        if (
          error.response.status === 401 &&
          error.response.data.message !==
            'The provided credentials are incorrect.'
        ) {
          removeToken();
          window.location.reload();
        }

        return this.failResource(error);
      }
    );
  }

  protected get request() {
    return this.#request;
  }

  protected responseResource<TData>(data: TData): ResponseOk<TData> {
    return {
      success: true,
      data,
    };
  }

  protected responsePaginateResource(data: any): ResponseOk<any> {
    return {
      success: true,
      data: data.data,
      links: data.links,
      meta: data.meta,
    };
  }

  protected failResource(error: any): ResponseError {
    return {
      success: false,
      message: error.response.data.message,
      errors: error.response.data.errors,
      fields: error.response.data.fields,
    };
  }
}
