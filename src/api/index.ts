import axios, { AxiosResponse } from 'axios';
import { getToken, removeToken } from '../helpers';

const apiURL: string = import.meta.env.VITE_APP_API_URL;

axios.defaults.baseURL = apiURL;
axios.defaults.headers.common = {
  Accept: 'application/json',
  Authorization: `Bearer ${getToken()}`,
};
axios.defaults.withCredentials = true;

type TSuccess<T> = {
  success: true;
  data: T;
};

type TError = {
  success: false;
  message?: string;
  fields?: string[] | null;
  errors?: any;
};

export type TResponse<T> = TSuccess<T> | TError;

export const setHeaders = (params: any = {}) => {
  return {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    params,
  };
};

export const transformErrorsArrayToString = (errors: {}): string => {
  if (typeof errors === 'object') {
    let message = '';
    (Object.keys(errors) as Array<keyof typeof errors>).forEach((key) => {
      message += errors[key] + ' ';
    });
    return message;
  } else return 'Something is wrong!';
};

export const checkTokenError = (error: any): void => {
  if (error.response.status === 401) {
    removeToken();
    window.location.href = '/';
  }
};

export const responseError = (response: AxiosResponse): TError => {
  return {
    success: false,
    message: response.data.message,
    fields: response.data.fields,
    errors: response.data.errors,
  };
};

export const catchReturn = (error: any): TError => {
  if (error.response) {
    checkTokenError(error);

    return responseError(error.response);
  }

  return {
    success: false,
    message: 'Something is wrong.',
    fields: null,
    errors: null,
  };
};

export default axios;
