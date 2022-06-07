import axios, { catchReturn, TResponse, responseError } from './index';
import { removeToken, setToken } from '../helpers';

axios.defaults.withCredentials = true;

export interface ILogin {
  username: string;
  password: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export default class UserApi {
  public static async login(data: ILogin): Promise<TResponse<IUser>> {
    try {
      const response = await axios.post('/login', data);

      if (!response.data.success) return responseError(response);

      const token: string = response.data.token;

      setToken(token);

      axios.defaults.headers.common = {
        Authorization: `Bearer ${token}`,
      };

      return {
        success: true,
        data: response.data.user,
      };
    } catch (error: any) {
      if (error.response) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }
  }

  public static async logout(): Promise<TResponse<null>> {
    try {
      const response = await axios.get('/logout');

      if (response.data.success) {
        removeToken();

        return {
          success: true,
          data: null,
        };
      }

      return {
        success: false,
        message: 'Something is wrong!',
      };
    } catch (error) {
      return catchReturn(error);
    }
  }

  public static async me(): Promise<TResponse<IUser>> {
    try {
      const response = await axios.get('/me');

      if (!response.data.success) return responseError(response);

      return {
        success: true,
        data: response.data.user,
      };
    } catch (error) {
      return catchReturn(error);
    }
  }
}
